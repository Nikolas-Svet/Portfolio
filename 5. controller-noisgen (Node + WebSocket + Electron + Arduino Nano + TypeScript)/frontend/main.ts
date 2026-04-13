import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureConfigFile, resolveRuntimePaths } from './src/services/config.service.js';
import startServer from './src/server/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  const runtimePaths = resolveRuntimePaths(app.getPath('userData'));
  const config = ensureConfigFile(runtimePaths.configPath);

  startServer(config.serialPort, runtimePaths.configPath, runtimePaths.logDirectory);

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#050816',
    show: false,
    title: 'Мониторинг поляризаций',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow
    .loadFile(path.join(__dirname, 'index.html'))
    .catch((error) => console.error('Не удалось загрузить index.html:', error));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
