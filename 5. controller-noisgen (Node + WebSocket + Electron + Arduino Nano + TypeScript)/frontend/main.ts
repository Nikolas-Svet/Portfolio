// main.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import startServer from './src/server/server.js';
import {fileURLToPath} from "node:url";

// Определение режима разработки
// const isDev = !app.isPackaged;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определение пути к ресурсам
// const resourcesPath = isDev ? __dirname : path.join(process.resourcesPath, 'assets');

// Пути к config.json и директории логов
// const configPath = path.join(resourcesPath, 'config.json');
const configPath = app.getPath('userData') + '/config.json';
// const logDirectory = path.join(resourcesPath, 'logs');const configPath = path.join(resourcesPath, 'config.json');
const logDirectory = app.getPath('userData') + '/logs';


// Функция для загрузки или создания config.json
function loadOrCreateConfig(): string {
  // Проверяем, существует ли config.json
  if (!existsSync(configPath)) {
    const defaultConfig = {
      serialPort: '',
      checkboxes: [
        { id: '0', label: '433мГц' },
        { id: '1', label: '5,8ГГц' },
        { id: '2', label: '700мГц' },
        { id: '3', label: '1.2ГГц' },
        { id: '4', label: '2.4ГГц' },
        { id: '5', label: '5.2ГГц' },
        { id: '6', label: '1.5ГГц' },
        { id: '7', label: '900мГц' },
        { id: '8', label: '433мГц' },
        { id: '9', label: '5,8ГГц' },
        { id: '10', label: '700мГц' },
        { id: '11', label: '1.2ГГц' },
        { id: '12', label: '2.4ГГц' },
        { id: '13', label: '5.2ГГц' },
        { id: '14', label: '1.5ГГц' },
        { id: '15', label: '900мГц' },
      ],
      custom: []
    };
    writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`Создан новый config.json по пути ${configPath}`);
    return defaultConfig.serialPort;
  }

  try {
    // Загружаем существующий файл
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));

    // Проверяем, есть ли ключ `checkboxes`
    if (!config.checkboxes || !Array.isArray(config.checkboxes)) {
      console.log('Ключ checkboxes отсутствует или некорректен, добавляем стандартные значения.');
      config.checkboxes = [
        { id: '0', label: '433мГц' },
        { id: '1', label: '5,8ГГц' },
        { id: '2', label: '700мГц' },
        { id: '3', label: '1.2ГГц' },
        { id: '4', label: '2.4ГГц' },
        { id: '5', label: '5.2ГГц' },
        { id: '6', label: '1.5ГГц' },
        { id: '7', label: '900мГц' },
        { id: '8', label: '433мГц' },
        { id: '9', label: '5,8ГГц' },
        { id: '10', label: '700мГц' },
        { id: '11', label: '1.2ГГц' },
        { id: '12', label: '2.4ГГц' },
        { id: '13', label: '5.2ГГц' },
        { id: '14', label: '1.5ГГц' },
        { id: '15', label: '900мГц' },
      ];
      writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`Ключ checkboxes добавлен в существующий config.json`);
    }

    return config.serialPort || '';
  } catch (error) {
    console.warn(`Ошибка чтения config.json: ${(error as Error).message}`);
    return '';
  }
}


let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow
      .loadFile(path.join(__dirname, 'index.html'))
      .catch((err) => console.error('Ошибка загрузки index.html:', err));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();

  // Загружаем конфигурацию и запускаем сервер
  const serialPortPath = loadOrCreateConfig();
  startServer(serialPortPath, configPath, logDirectory);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
