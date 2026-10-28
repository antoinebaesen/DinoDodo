import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlarmConfig, AudioLibrary, SaveAlarmResult, PlaybackState, PlaybackAction, SafetyAlarmState } from './models';
import { RadioAlarm } from './radio-alarm.plugin';

const WEB_CONFIG_KEY = 'radio-reveil-web-config';

@Injectable({ providedIn: 'root' })
export class RadioAlarmService {
  readonly isNative = Capacitor.getPlatform() === 'android';

  async chooseRootFolder(): Promise<{ rootUri: string; rootName: string }> {
    if (this.isNative) {
      return RadioAlarm.chooseRootFolder();
    }

    return { rootUri: 'web-demo://radio-reveil', rootName: 'RadioReveil (aperçu)' };
  }

  async listLibraries(): Promise<AudioLibrary[]> {
    if (this.isNative) {
      return (await RadioAlarm.listLibraries()).libraries;
    }

    return [
      { name: 'OST', uri: 'web-demo://ost', audioCount: 42 },
      { name: 'Calme', uri: 'web-demo://calme', audioCount: 18 },
      { name: 'Énergique', uri: 'web-demo://energique', audioCount: 27 },
    ];
  }

  async getConfig(): Promise<AlarmConfig> {
    if (this.isNative) {
      return RadioAlarm.getConfig();
    }

    const stored = localStorage.getItem(WEB_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored) as AlarmConfig;
    }

    return {
      enabled: false,
      hour: 9,
      minute: 0,
      libraryUri: 'web-demo://ost',
      libraryName: 'OST',
      randomStart: false,
      rootUri: 'web-demo://radio-reveil',
      rootName: 'RadioReveil (aperçu)',
      nextTriggerAt: null,
      exactAlarmAllowed: true,
    };
  }

  async saveConfig(config: Omit<AlarmConfig, 'rootUri' | 'rootName' | 'nextTriggerAt' | 'exactAlarmAllowed'>): Promise<SaveAlarmResult> {
    if (this.isNative) {
      return RadioAlarm.saveConfig(config);
    }

    const previous = await this.getConfig();
    const nextTriggerAt = config.enabled ? this.computeNextTrigger(config.hour, config.minute) : null;
    localStorage.setItem(
      WEB_CONFIG_KEY,
      JSON.stringify({ ...previous, ...config, nextTriggerAt, exactAlarmAllowed: true }),
    );

    return { scheduled: config.enabled, needsExactAlarmPermission: false, nextTriggerAt };
  }

  async testPlayback(library: AudioLibrary, randomStart: boolean): Promise<void> {
    if (this.isNative) {
      await RadioAlarm.testPlayback({
        libraryUri: library.uri,
        libraryName: library.name,
        randomStart,
      });
      return;
    }

    console.info('[Radio Réveil] Test audio simulé dans le navigateur.', { library, randomStart });
  }

  async stopPlayback(): Promise<void> {
    if (this.isNative) {
      await RadioAlarm.stopPlayback();
    }
  }

  async openExactAlarmSettings(): Promise<void> {
    if (this.isNative) {
      await RadioAlarm.openExactAlarmSettings();
    }
  }

  async getPlaybackState(): Promise<PlaybackState> {
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

  private computeNextTrigger(hour: number, minute: number): number {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    return next.getTime();
  }
}
