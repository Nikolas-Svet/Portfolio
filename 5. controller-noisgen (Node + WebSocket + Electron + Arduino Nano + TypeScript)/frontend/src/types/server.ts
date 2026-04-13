import type { AppConfig } from './config.js';

export type BridgeMessageType = 'hello' | 'state' | 'command' | 'error';

export interface BridgeMessage {
  type: BridgeMessageType;
  payload: unknown;
}

export interface BridgeHelloPayload {
  serialPortPath: string;
  config: AppConfig;
}

export interface ServerBootstrapOptions {
  serialPortPath: string;
  configPath: string;
  logDirectory: string;
  port?: number;
  baudRate?: number;
}
