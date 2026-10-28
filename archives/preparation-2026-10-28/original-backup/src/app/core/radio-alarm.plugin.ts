import { registerPlugin } from '@capacitor/core';
import { AlarmConfig, AudioLibrary, SaveAlarmResult } from './models';

export interface RadioAlarmPlugin {
  chooseRootFolder(): Promise<{ rootUri: string; rootName: string }>;
  listLibraries(): Promise<{ libraries: AudioLibrary[] }>;
  getConfig(): Promise<AlarmConfig>;
  saveConfig(options: {
    enabled: boolean;
    hour: number;
    minute: number;
    libraryUri: string | null;
    libraryName: string | null;
    randomStart: boolean;
  }): Promise<SaveAlarmResult>;
  testPlayback(options: {
    libraryUri: string;
    libraryName: string;
    randomStart: boolean;
  }): Promise<void>;
  stopPlayback(): Promise<void>;
  canScheduleExactAlarms(): Promise<{ allowed: boolean }>;
  openExactAlarmSettings(): Promise<void>;
}

export const RadioAlarm = registerPlugin<RadioAlarmPlugin>('RadioAlarm');
