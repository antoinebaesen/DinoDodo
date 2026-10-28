from pathlib import Path
root=Path(__file__).resolve().parents[1]
def edit(path,a,b):
 p=root/path; s=p.read_text(encoding='utf-8-sig'); assert a in s,(path,a); p.write_text(s.replace(a,b),encoding='utf-8')
edit('capacitor.config.ts',"appId: 'com.reveillosaure.app'","appId: 'com.radioreveil.app'")
edit('capacitor.config.ts',"appName: 'Reveillosaure'","appName: 'Dino-Dodo'")
edit('src/index.html','Réveillosaure','Dino-Dodo') if 'Réveillosaure' in (root/'src/index.html').read_text() else None
p=root/'src/index.html'; s=p.read_text(); import re; p.write_text(re.sub(r'<title>.*?</title>','<title>Dino-Dodo</title>',s),encoding='utf-8')
edit('src/app/app.component.html','🦕 Réveillosaure.','🦕 Dino-Dodo')
edit('scripts/setup-android.mjs','Radio Réveil','Dino-Dodo')
base='native/android/java/com/radioreveil/app/'
edit(base+'RadioAlarmPlugin.java','import android.provider.Settings;','import android.provider.Settings;\nimport android.provider.AlarmClock;\nimport java.util.Calendar;')
edit(base+'RadioAlarmPlugin.java','    @PluginMethod\n    public void canScheduleExactAlarms', '''    @PluginMethod
    public void getPlaybackState(PluginCall call) {
        getActivity().runOnUiThread(() -> call.resolve(PlaybackService.state(getContext())));
    }

    @PluginMethod
    public void controlPlayback(PluginCall call) {
        String action = call.getString("action", "");
        if (!java.util.Arrays.asList("pause", "resume", "next", "forward", "restart").contains(action)) {
            call.reject("Commande inconnue."); return;
        }
        ContextCompat.startForegroundService(getContext(), new Intent(getContext(), PlaybackService.class).setAction(action));
        call.resolve();
    }

    @PluginMethod
    public void getSafetyAlarm(PluginCall call) {
        JSObject result = new JSObject();
        result.put("triggerAt", getContext().getSharedPreferences("dino_safety", 0).getLong("triggerAt", 0));
        result.put("cancelRequested", getContext().getSharedPreferences("dino_safety", 0).getBoolean("cancelRequested", false));
        call.resolve(result);
    }

    @PluginMethod
    public void requestSafetyAlarm(PluginCall call) {
        Long triggerAt = call.getLong("triggerAt");
        if (triggerAt == null || triggerAt <= System.currentTimeMillis() || triggerAt - System.currentTimeMillis() >= 24L * 60 * 60 * 1000) {
            call.reject("Horloge ne permet pas de préciser une date pour une alarme ponctuelle. Programme la sécurité moins de 24 heures avant son déclenchement."); return;
        }
        android.content.SharedPreferences prefs = getContext().getSharedPreferences("dino_safety", 0);
        long previous = prefs.getLong("triggerAt", 0);
        if (previous > System.currentTimeMillis() && previous != triggerAt) {
            call.reject("Une ancienne sécurité est peut-être encore active. Désactive-la dans Horloge puis confirme-le ici avant de changer l’horaire."); return;
        }
        Calendar date = Calendar.getInstance(); date.setTimeInMillis(triggerAt);
        Intent intent = new Intent(AlarmClock.ACTION_SET_ALARM)
            .putExtra(AlarmClock.EXTRA_HOUR, date.get(Calendar.HOUR_OF_DAY))
            .putExtra(AlarmClock.EXTRA_MINUTES, date.get(Calendar.MINUTE))
            .putExtra(AlarmClock.EXTRA_MESSAGE, "Dino-Dodo sécurité " + triggerAt)
            .putExtra(AlarmClock.EXTRA_SKIP_UI, false);
        try {
            getActivity().startActivity(intent);
            prefs.edit().putLong("triggerAt", triggerAt).putBoolean("cancelRequested", false).apply();
            call.resolve();
        } catch (android.content.ActivityNotFoundException e) { call.reject("Aucune application Horloge compatible n’est installée."); }
    }

    @PluginMethod
    public void dismissSafetyAlarm(PluginCall call) {
        android.content.SharedPreferences prefs = getContext().getSharedPreferences("dino_safety", 0);
        long triggerAt = prefs.getLong("triggerAt", 0);
        if (triggerAt == 0) { call.resolve(); return; }
        Intent intent = new Intent(AlarmClock.ACTION_DISMISS_ALARM)
            .putExtra(AlarmClock.EXTRA_ALARM_SEARCH_MODE, AlarmClock.ALARM_SEARCH_MODE_LABEL)
            .putExtra(AlarmClock.EXTRA_MESSAGE, "Dino-Dodo sécurité " + triggerAt);
        try {
            getActivity().startActivity(intent);
            prefs.edit().putBoolean("cancelRequested", true).apply();
            call.resolve();
        } catch (android.content.ActivityNotFoundException e) { call.reject("Ouvre Horloge pour désactiver la sécurité manuellement."); }
    }

    @PluginMethod
    public void confirmSafetyDisabled(PluginCall call) {
        getContext().getSharedPreferences("dino_safety", 0).edit().clear().apply();
        call.resolve();
    }

    @PluginMethod
    public void canScheduleExactAlarms''')
edit('native/android/AndroidManifest.xml','    <uses-permission android:name="android.permission.INTERNET" />','    <uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="com.android.alarm.permission.SET_ALARM" />')
p=root/'src/app/core/models.ts'; p.write_text(p.read_text()+'''\nexport interface PlaybackState {
  title: string;
  trackUri: string;
  libraryName: string;
  positionMs: number;
  durationMs: number;
  playing: boolean;
  loading: boolean;
  error: string;
}
export type PlaybackAction = 'pause' | 'resume' | 'next' | 'forward' | 'restart';
export interface SafetyAlarmState { triggerAt: number; cancelRequested: boolean; }
''',encoding='utf-8')
edit('src/app/core/radio-alarm.plugin.ts','AlarmConfig, AudioLibrary, SaveAlarmResult','AlarmConfig, AudioLibrary, SaveAlarmResult, PlaybackState, PlaybackAction, SafetyAlarmState')
edit('src/app/core/radio-alarm.plugin.ts','  stopPlayback(): Promise<void>;','''  stopPlayback(): Promise<void>;
  getPlaybackState(): Promise<PlaybackState>;
  controlPlayback(options: {action: PlaybackAction}): Promise<void>;
  getSafetyAlarm(): Promise<SafetyAlarmState>;
  requestSafetyAlarm(options: {triggerAt: number}): Promise<void>;
  dismissSafetyAlarm(): Promise<void>;
  confirmSafetyDisabled(): Promise<void>;''')
edit('src/app/core/radio-alarm.service.ts','AlarmConfig, AudioLibrary, SaveAlarmResult','AlarmConfig, AudioLibrary, SaveAlarmResult, PlaybackState, PlaybackAction, SafetyAlarmState')
edit('src/app/core/radio-alarm.service.ts','  private computeNextTrigger','''  async getPlaybackState(): Promise<PlaybackState> {
    if (this.isNative) return RadioAlarm.getPlaybackState();
    return { title: '', trackUri: '', libraryName: '', positionMs: 0, durationMs: 0, playing: false, loading: false, error: '' };
  }
  async controlPlayback(action: PlaybackAction): Promise<void> {
    if (this.isNative) await RadioAlarm.controlPlayback({ action });
  }
  async getSafetyAlarm(): Promise<SafetyAlarmState> {
    return this.isNative ? RadioAlarm.getSafetyAlarm() : {triggerAt: 0, cancelRequested: false};
  }
  async requestSafetyAlarm(triggerAt: number): Promise<void> {
    if (this.isNative) await RadioAlarm.requestSafetyAlarm({triggerAt});
  }
  async dismissSafetyAlarm(): Promise<void> {
    if (this.isNative) await RadioAlarm.dismissSafetyAlarm();
  }
  async confirmSafetyDisabled(): Promise<void> {
    if (this.isNative) await RadioAlarm.confirmSafetyDisabled();
  }

  private computeNextTrigger''')
edit('src/app/app.component.ts','Component, OnInit','Component, OnInit, OnDestroy, NgZone')
edit('src/app/app.component.ts',"import { AudioLibrary }", "import { AudioLibrary, PlaybackState, PlaybackAction, SafetyAlarmState }")
edit('src/app/app.component.ts','implements OnInit','implements OnInit, OnDestroy')
edit('src/app/app.component.ts','  time =', '''  playback: PlaybackState = {title: '', trackUri: '', libraryName: '', positionMs: 0, durationMs: 0, playing: false, loading: false, error: ''};
  safety: SafetyAlarmState = {triggerAt: 0, cancelRequested: false};
  controlling = false;
  private poll?: ReturnType<typeof setInterval>;
  private refreshing = false;
  time =''')
edit('src/app/app.component.ts','constructor(readonly alarmService: RadioAlarmService)', 'constructor(readonly alarmService: RadioAlarmService, private zone: NgZone)')
edit('src/app/app.component.ts','    await this.load();','''    await this.load();
    await this.refreshPlayer();
    this.poll = setInterval(() => void this.refreshPlayer(), 1000);''')
edit('src/app/app.component.ts','  get selectedLibrary():','''  ngOnDestroy(): void { if (this.poll) clearInterval(this.poll); }

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

  get selectedLibrary():''')
edit('src/app/app.component.ts',"      this.message = this.enabled ? 'Réveil programmé.' : 'Réveil désactivé.';",'''      this.message = result.scheduled ? 'Réveil programmé.' : (this.enabled ? 'Réveil non programmé : autorisation requise.' : 'Réveil désactivé.');
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
      await this.refreshPlayer();''')
edit('src/app/app.component.html','        <section class="glass-card alarm-card">','''        <section class="glass-card player-card" aria-label="Lecteur audio">
          <span class="section-kicker">{{ playback.playing ? 'EN COURS DE LECTURE' : 'DERNIER AUDIO' }}</span>
          <h2>{{ playback.title || 'Aucun audio lancé' }}</h2>
          @if (playback.trackUri) {
            <p class="muted">{{ playback.libraryName }} · {{ playback.loading ? 'Préparation…' : (playback.playing ? 'Lecture' : 'En pause · position mémorisée') }}</p>
            <progress [value]="playback.positionMs" [max]="playback.durationMs || 1" aria-label="Avancement de la lecture"></progress>
            <div class="player-times"><span>{{ formatDuration(playback.positionMs) }}</span><span>{{ formatDuration(playback.durationMs) }}</span></div>
            <div class="player-controls">
              <ion-button (click)="control(playback.playing ? 'pause' : 'resume')" [disabled]="controlling || playback.loading">{{ playback.playing ? 'Pause' : 'Reprendre' }}</ion-button>
              <ion-button fill="outline" (click)="control('next')" [disabled]="controlling || playback.loading">Suivant</ion-button>
              <ion-button fill="outline" (click)="control('forward')" [disabled]="controlling || playback.loading || !playback.playing">+1 min</ion-button>
              <ion-button fill="clear" (click)="control('restart')" [disabled]="controlling || playback.loading">Depuis le début</ion-button>
            </div>
            @if (playback.error) { <p class="feedback error" role="alert">{{ playback.error }}</p> }
          } @else { <p class="muted">Lance un audio avec Tester. Tu pourras le reprendre ici, même après fermeture.</p> }
        </section>

        <section class="glass-card">
          <span class="section-kicker">ALARME DE SÉCURITÉ · HORLOGE</span>
          <h2>{{ safety.triggerAt ? safetyLabel : '15 minutes après le réveil' }}</h2>
          <p class="muted">Une alarme ponctuelle est demandée à Horloge à chaque enregistrement du réveil. Confirme sa création dans Horloge. Pour les jours suivants, enregistre de nouveau le réveil.</p>
          @if (safety.triggerAt) {
            <p class="muted">{{ safety.cancelRequested ? 'Désactivation demandée · à vérifier dans Horloge.' : 'Création demandée · à vérifier dans Horloge.' }}</p>
            <ion-button fill="outline" (click)="dismissSafety()">Désactiver la sécurité</ion-button>
            @if (safety.cancelRequested) { <ion-button fill="clear" (click)="confirmSafety()">J’ai vérifié : elle est désactivée</ion-button> }
          }
        </section>

        <section class="glass-card alarm-card">''')
p=root/'src/app/app.component.scss';p.write_text(p.read_text()+'''\n.player-card h2 { overflow-wrap: anywhere; margin-top: 8px; }
.player-card progress { width: 100%; height: 8px; accent-color: #8275bb; }
.player-times { display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; margin: 6px 0 12px; }
.player-controls { display: flex; flex-wrap: wrap; gap: 4px; }
.player-controls ion-button { text-transform: none; --border-radius: 14px; }
''',encoding='utf-8')
