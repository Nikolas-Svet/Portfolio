export interface FrequencyCheckbox {
  id: string;
  label: string;
}

export interface FrequencyPreset extends FrequencyCheckbox {
  group: 'vertical' | 'horizontal';
}

export type CustomModeConfig = Record<string, unknown>;

export interface AppConfig {
  serialPort: string;
  checkboxes: FrequencyCheckbox[];
  custom: CustomModeConfig[];
}

export interface AppPaths {
  configPath: string;
  logDirectory: string;
}
