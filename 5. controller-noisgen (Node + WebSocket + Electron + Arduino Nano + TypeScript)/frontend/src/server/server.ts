import { mkdirSync } from 'node:fs';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { SerialPort } from 'serialport';
import { WebSocket, WebSocketServer } from 'ws';
import { BRIDGE_PORT, DEFAULT_BAUD_RATE } from '../constants/runtime.js';
import { ensureConfigFile, readConfigFile } from '../services/config.service.js';
import type { BridgeMessage } from '../types/server.js';

function createLoggerInstance(logDirectory: string) {
  mkdirSync(logDirectory, { recursive: true });

  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.printf(({ level, message, timestamp, ...meta }) => {
        const details = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}] ${message}${details}`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
      new DailyRotateFile({
        dirname: logDirectory,
        filename: 'controller-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
      }),
    ],
  });
}

function serializeMessage(message: BridgeMessage): string {
  return JSON.stringify(message);
}

function broadcast(clients: Set<WebSocket>, message: BridgeMessage): void {
  const payload = serializeMessage(message);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function openSerialPort(serialPortPath: string, logger: ReturnType<typeof createLoggerInstance>) {
  if (!serialPortPath.trim()) {
    logger.warn('Serial port path is empty. The websocket bridge will run without hardware.');
    return null;
  }

  const port = new SerialPort({
    path: serialPortPath,
    baudRate: DEFAULT_BAUD_RATE,
    autoOpen: false,
  });

  port.open((error) => {
    if (error) {
      logger.warn(`Failed to open serial port ${serialPortPath}: ${error.message}`);
      return;
    }

    logger.info(`Serial port opened: ${serialPortPath}`);
  });

  return port;
}

export default function startServer(
  serialPortPath: string,
  configPath: string,
  logDirectory: string,
): void {
  const logger = createLoggerInstance(logDirectory);
  const clients = new Set<WebSocket>();
  const config = ensureConfigFile(configPath);
  const serialPort = openSerialPort(serialPortPath, logger);
  const wsServer = new WebSocketServer({ port: BRIDGE_PORT });

  logger.info(`WebSocket bridge listening on ws://127.0.0.1:${BRIDGE_PORT}`);

  if (serialPort) {
    serialPort.on('data', (chunk) => {
      broadcast(clients, {
        type: 'state',
        payload: chunk.toString('utf-8'),
      });
    });

    serialPort.on('error', (error) => {
      logger.error(`Serial port error: ${error.message}`);
    });
  }

  wsServer.on('connection', (socket) => {
    clients.add(socket);
    logger.info('WebSocket client connected');

    const helloMessage: BridgeMessage = {
      type: 'hello',
      payload: {
        serialPortPath,
        config,
      },
    };

    socket.send(serializeMessage(helloMessage));

    socket.on('message', (rawMessage) => {
      const message = rawMessage.toString();
      logger.info(`WebSocket message received: ${message}`);

      if (serialPort?.isOpen) {
        serialPort.write(message);
      }
    });

    socket.on('close', () => {
      clients.delete(socket);
      logger.info('WebSocket client disconnected');
    });
  });

  wsServer.on('error', (error) => {
    logger.error(`WebSocket server error: ${error.message}`);
  });

  const snapshot = readConfigFile(configPath);
  if (snapshot) {
    logger.info(`Config snapshot loaded with ${snapshot.checkboxes.length} frequency slots`);
  }
}
