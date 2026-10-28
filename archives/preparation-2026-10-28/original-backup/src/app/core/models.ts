export interface AudioLibrary {
  name: string;
  uri: string;
  audioCount: number;
}

export interface AlarmConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  libraryUri: string | null;
  libraryName: string | null;
  randomStart: boolean;
  rootUri: string | null;
  rootName: string | null;
  nextTriggerAt: number | null;
  exactAlarmAllowed: boolean;
}

export interface SaveAlarmResult {
  scheduled: boolean;
  needsExactAlarmPermission: boolean;
  nextTriggerAt: number | null;
}
