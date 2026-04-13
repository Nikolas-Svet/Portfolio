import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { FREQUENCY_PRESETS } from '../constants/frequencies.js';
import type { AppConfig, AppPaths, CustomModeConfig, FrequencyCheckbox } from '../types/config.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function resolveRuntimePaths(userDataPath: string): AppPaths {
  return {
    configPath: path.join(userDataPath, 'config.json'),
    logDirectory: path.join(userDataPath, 'logs'),
  };
}

export function createDefaultCheckboxes(): FrequencyCheckbox[] {
  return FREQUENCY_PRESETS.map(({ id, label }) => ({ id, label }));
}

export function createDefaultConfig(): AppConfig {
  return {
    serialPort: '',
    checkboxes: createDefaultCheckboxes(),
    custom: [],
  };
}

function normalizeCheckboxes(value: unknown): FrequencyCheckbox[] {
  const defaults = createDefaultCheckboxes();

  if (!Array.isArray(value)) {
    return defaults;
  }

  return defaults.map((fallback, index) => {
    const candidate = value[index];

    if (!isRecord(candidate)) {
      return fallback;
    }

    return {
      id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id.trim() : fallback.id,
      label:
        typeof candidate.label === 'string' && candidate.label.trim()
          ? candidate.label.trim()
          : fallback.label,
    };
  });
}

function normalizeCustomModes(value: unknown): CustomModeConfig[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({ ...item }));
}

export function normalizeConfig(candidate: unknown): AppConfig {
  if (!isRecord(candidate)) {
    return createDefaultConfig();
  }

  return {
    serialPort:
      typeof candidate.serialPort === 'string' && candidate.serialPort.trim()
        ? candidate.serialPort.trim()
        : '',
    checkboxes: normalizeCheckboxes(candidate.checkboxes),
    custom: normalizeCustomModes(candidate.custom),
  };
}

export function writeConfigFile(configPath: string, config: AppConfig): void {
  mkdirSync(path.dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function readConfigFile(configPath: string): AppConfig | null {
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const rawConfig = readFileSync(configPath, 'utf-8');
    return normalizeConfig(JSON.parse(rawConfig) as unknown);
  } catch (error) {
    console.warn(`Не удалось прочитать config.json: ${(error as Error).message}`);
    return null;
  }
}

export function ensureConfigFile(configPath: string): AppConfig {
  if (!existsSync(configPath)) {
    const defaultConfig = createDefaultConfig();
    writeConfigFile(configPath, defaultConfig);
    return defaultConfig;
  }

  try {
    const rawConfig = readFileSync(configPath, 'utf-8');
    const parsedConfig = JSON.parse(rawConfig) as unknown;
    const normalizedConfig = normalizeConfig(parsedConfig);

    if (JSON.stringify(parsedConfig) !== JSON.stringify(normalizedConfig)) {
      writeConfigFile(configPath, normalizedConfig);
    }

    return normalizedConfig;
  } catch (error) {
    const defaultConfig = createDefaultConfig();
    console.warn(`Не удалось нормализовать config.json: ${(error as Error).message}`);
    writeConfigFile(configPath, defaultConfig);
    return defaultConfig;
  }
}
