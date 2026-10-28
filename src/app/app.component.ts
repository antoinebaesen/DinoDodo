import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  alarmOutline,
  checkmarkCircleOutline,
  folderOpenOutline,
  musicalNotesOutline,
  playOutline,
  refreshOutline,
  shuffleOutline,
  stopOutline,
  warningOutline,
} from 'ionicons/icons';
import { AudioLibrary, PlaybackState, PlaybackAction, SafetyAlarmState } from './core/models';
import { RadioAlarmService } from './core/radio-alarm.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonApp,
    IonContent,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonToggle,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  playback: PlaybackState = {title: '', trackUri: '', libraryName: '', positionMs: 0, durationMs: 0, playing: false, loading: false, error: ''};
  safety: SafetyAlarmState = {triggerAt: 0, cancelRequested: false};
  controlling = false;
  private poll?: ReturnType<typeof setInterval>;
  private refreshing = false;
  time = '09:00';
  enabled = false;
  randomStart = false;

  rootName: string | null = null;
  libraries: AudioLibrary[] = [];
  selectedLibraryUri: string | null = null;
  nextTriggerAt: number | null = null;
  exactAlarmAllowed = true;

  loading = true;
  saving = false;
  testing = false;
  message = '';
  error = '';

  constructor(readonly alarmService: RadioAlarmService, private zone: NgZone) {
    addIcons({
      alarmOutline,
      checkmarkCircleOutline,
      folderOpenOutline,
      musicalNotesOutline,
      playOutline,
      refreshOutline,
      shuffleOutline,
      stopOutline,
      warningOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.load();
    await this.refreshPlayer();
    this.poll = setInterval(() => void this.refreshPlayer(), 1000);
  }

  ngOnDestroy(): void { if (this.poll) clearInterval(this.poll); }

  async refreshPlayer(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const [playback, safety] = await Promise.all([this.alarmService.getPlaybackState(), this.alarmService.getSafetyAlarm()]);
      this.zone.run(() => { this.playback = playback; this.safety = safety; });
    } catch (error) { console.error(error); }
    finally { this.refreshing = false; }
  }

  async control(action: PlaybackAction): Promise<void> {
    this.controlling = true; this.clearFeedback();
    try { await this.alarmService.controlPlayback(action); await this.refreshPlayer(); }
    catch (error) { this.handleError(error, 'Commande impossible.'); }
    finally { this.controlling = false; }
  }

  formatDuration(ms: number): string {
    const seconds = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }
  get safetyLabel(): string {
    return new Intl.DateTimeFormat('fr-FR', {weekday: 'long', hour: '2-digit', minute: '2-digit'}).format(this.safety.triggerAt);
  }
  async dismissSafety(): Promise<void> {
    this.clearFeedback();
    try { await this.alarmService.dismissSafetyAlarm(); this.message = 'Demande envoyée à Horloge. Vérifie la désactivation.'; await this.refreshPlayer(); }
    catch (error) { this.handleError(error, 'Désactivation impossible.'); }
  }
  async confirmSafety(): Promise<void> {
    try { await this.alarmService.confirmSafetyDisabled(); await this.refreshPlayer(); }
    catch (error) { this.handleError(error, 'Confirmation impossible.'); }
  }

  get selectedLibrary(): AudioLibrary | undefined {
    return this.libraries.find((library) => library.uri === this.selectedLibraryUri);
  }

  get canSave(): boolean {
    return !this.enabled || !!this.selectedLibrary;
  }

  get nextTriggerLabel(): string {
    if (!this.enabled || !this.nextTriggerAt) {
      return 'Réveil désactivé';
    }

    const date = new Date(this.nextTriggerAt);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  async chooseFolder(): Promise<void> {
    this.clearFeedback();
    try {
      const root = await this.alarmService.chooseRootFolder();
      this.rootName = root.rootName;
      await this.refreshLibraries();
      this.message = 'Dossier audio enregistré.';
    } catch (error) {
      this.handleError(error, 'Impossible de sélectionner ce dossier.');
    }
  }

  async refreshLibraries(): Promise<void> {
    this.clearFeedback();
    try {
      const previous = this.selectedLibraryUri;
      this.libraries = await this.alarmService.listLibraries();

      if (!this.libraries.some((library) => library.uri === previous)) {
        this.selectedLibraryUri = this.libraries[0]?.uri ?? null;
      }
    } catch (error) {
      this.handleError(error, 'Impossible de lire les bibliothèques.');
    }
  }

  async save(): Promise<void> {
    this.clearFeedback();

    if (this.enabled && !this.selectedLibrary) {
      this.error = 'Choisis une bibliothèque avant d’activer le réveil.';
      return;
    }

    const [hour, minute] = this.parseTime(this.time);
    this.saving = true;

    try {
      const result = await this.alarmService.saveConfig({
        enabled: this.enabled,
        hour,
        minute,
        libraryUri: this.selectedLibrary?.uri ?? null,
        libraryName: this.selectedLibrary?.name ?? null,
        randomStart: this.randomStart,
      });

      this.nextTriggerAt = result.nextTriggerAt;
      this.exactAlarmAllowed = !result.needsExactAlarmPermission;
      this.message = result.scheduled ? 'Réveil programmé.' : (this.enabled ? 'Réveil non programmé : autorisation requise.' : 'Réveil désactivé.');
      if (result.scheduled && result.nextTriggerAt && this.alarmService.isNative) {
        try {
          await this.alarmService.requestSafetyAlarm(result.nextTriggerAt + 15 * 60 * 1000);
          this.message += ' Confirme l’alarme de sécurité dans Horloge.';
        } catch (error) {
          this.error = 'Réveil principal enregistré. Sécurité non créée : ' + (error instanceof Error ? error.message : String(error));
        }
      } else if (!this.enabled && this.safety.triggerAt > Date.now()) {
        this.message += ' La sécurité dans Horloge doit être désactivée séparément avec le bouton ci-dessus.';
      }
      await this.refreshPlayer();
    } catch (error) {
      this.handleError(error, 'Impossible d’enregistrer le réveil.');
    } finally {
      this.saving = false;
    }
  }

  async test(): Promise<void> {
    this.clearFeedback();
    const library = this.selectedLibrary;
    if (!library) {
      this.error = 'Choisis d’abord une bibliothèque.';
      return;
    }

    this.testing = true;
    try {
      await this.alarmService.testPlayback(library, this.randomStart);
      this.message = this.alarmService.isNative
        ? 'Lecture test lancée.'
        : 'Aperçu web : la lecture native est simulée.';
    } catch (error) {
      this.handleError(error, 'Impossible de lancer le test.');
    } finally {
      this.testing = false;
    }
  }

  async stop(): Promise<void> {
    this.clearFeedback();
    try {
      await this.alarmService.stopPlayback();
      this.message = 'Lecture arrêtée.';
    } catch (error) {
      this.handleError(error, 'Impossible d’arrêter la lecture.');
    }
  }

  async openExactAlarmSettings(): Promise<void> {
    await this.alarmService.openExactAlarmSettings();
  }

  private async load(): Promise<void> {
    this.loading = true;
    try {
      const config = await this.alarmService.getConfig();
      this.enabled = config.enabled;
      this.randomStart = config.randomStart;
      this.time = `${String(config.hour).padStart(2, '0')}:${String(config.minute).padStart(2, '0')}`;
      this.rootName = config.rootName;
      this.selectedLibraryUri = config.libraryUri;
      this.nextTriggerAt = config.nextTriggerAt;
      this.exactAlarmAllowed = config.exactAlarmAllowed;

      if (this.rootName) {
        await this.refreshLibraries();
      }
    } catch (error) {
      this.handleError(error, 'Impossible de charger la configuration.');
    } finally {
      this.loading = false;
    }
  }

  private parseTime(value: string): [number, number] {
    const [hour, minute] = value.split(':').map(Number);
    return [Number.isFinite(hour) ? hour : 9, Number.isFinite(minute) ? minute : 0];
  }

  private clearFeedback(): void {
    this.message = '';
    this.error = '';
  }

  private handleError(error: unknown, fallback: string): void {
    console.error(error);
    this.error = error instanceof Error && error.message ? error.message : fallback;
  }
}
