// @ts-check

/**
 * @typedef {import('../types/dashboard.js').DashboardView} DashboardView
 * @typedef {import('../types/server.js').BridgeMessage} BridgeMessage
 */

import { BRIDGE_PORT, TIMER_PRESETS } from '../constants/runtime.js';
import {
  COMBINED_FREQUENCIES,
  HORIZONTAL_FREQUENCIES,
  VERTICAL_FREQUENCIES,
} from '../constants/frequencies.js';
import { renderMonitoringCharts } from './chart.service.js';
import { queryAll, queryRequired, setActive, setHidden, setText, setValue } from './dom.service.js';

/** @type {DashboardView} */
let currentView = 'manual';

/** @type {WebSocket | null} */
let bridgeSocket = null;

/** @type {number} */
let notificationTimer = 0;

const STORAGE_PORT_KEY = 'controller.selectedPort';
const STORAGE_VIEW_KEY = 'controller.dashboardView';

/**
 * @typedef {Object} DashboardElements
 * @property {HTMLElement} manualButton
 * @property {HTMLElement} modesButton
 * @property {HTMLElement} cancelButton
 * @property {HTMLElement} backButton
 * @property {HTMLElement} nextButton
 * @property {HTMLElement} createButton
 * @property {HTMLElement} applyButton
 * @property {HTMLElement} customButton
 * @property {HTMLElement} modeSwitcher
 * @property {HTMLElement} verticalSection
 * @property {HTMLElement} horizontalSection
 * @property {HTMLElement} combinedGroup
 * @property {HTMLElement} modeDrawer
 * @property {HTMLElement} customMode
 * @property {HTMLInputElement} customNameInput
 * @property {HTMLInputElement} customTimeInput
 * @property {HTMLElement} connectionStatus
 * @property {HTMLElement} addPortButton
 * @property {HTMLElement} emergencyButton
 * @property {HTMLElement} disableFanButton
 * @property {HTMLElement} fanStatus
 * @property {HTMLInputElement} portInput
 * @property {HTMLElement} portConfirmButton
 * @property {HTMLElement} portCancelButton
 * @property {HTMLElement} timeModal
 * @property {HTMLInputElement} timeInput
 * @property {HTMLElement} timeConfirmButton
 * @property {HTMLElement} timeCancelButton
 * @property {HTMLElement} deleteOverlay
 * @property {HTMLElement} deleteConfirmButton
 * @property {HTMLElement} deleteCancelButton
 * @property {HTMLElement} signalOverlay
 * @property {HTMLElement} signalContinueButton
 * @property {HTMLElement} signalDisableButton
 * @property {HTMLElement} notification
 * @property {HTMLElement} notificationTitle
 * @property {HTMLElement} notificationMessage
 * @property {HTMLElement} notificationClose
 * @property {HTMLElement} timerDisplay
 * @property {HTMLElement} timerStatus
 * @property {HTMLElement} timerPlayButton
 * @property {HTMLElement} timerPresets
 * @property {HTMLElement} activeModules
 * @property {HTMLElement} additionalCharge
 * @property {HTMLElement} voltage
 * @property {HTMLElement} batteryValue
 * @property {HTMLElement} batteryFill
 * @property {HTMLElement} signalingOne
 * @property {HTMLElement} signalingTwo
 * @property {HTMLElement} signalingThree
 * @property {HTMLElement} signalingFour
 * @property {HTMLCanvasElement} verticalChart
 * @property {HTMLCanvasElement} horizontalChart
 */

/**
 * @returns {DashboardElements}
 */
function collectElements() {
  return {
    manualButton: queryRequired('#manual-button'),
    modesButton: queryRequired('#modes-button'),
    cancelButton: queryRequired('#cancel'),
    backButton: queryRequired('#back'),
    nextButton: queryRequired('#next'),
    createButton: queryRequired('#create'),
    applyButton: queryRequired('#apply-button'),
    customButton: queryRequired('#custom'),
    modeSwitcher: queryRequired('.mode-switcher'),
    verticalSection: queryRequired('[data-frequency-group="vertical"]'),
    horizontalSection: queryRequired('[data-frequency-group="horizontal"]'),
    combinedGroup: queryRequired('#row'),
    modeDrawer: queryRequired('.mode-drawer'),
    customMode: queryRequired('.custom-mode'),
    customNameInput: /** @type {HTMLInputElement} */ (queryRequired('#nameCustom')),
    customTimeInput: /** @type {HTMLInputElement} */ (queryRequired('#timeCustom')),
    connectionStatus: queryRequired('#block-7 .panel__status'),
    addPortButton: queryRequired('#add_port'),
    emergencyButton: queryRequired('#emergencyStop'),
    disableFanButton: queryRequired('#disable_fan'),
    fanStatus: queryRequired('#fan1'),
    portInput: /** @type {HTMLInputElement} */ (queryRequired('.overlay--ports input')),
    portConfirmButton: queryRequired('#accept_add_port'),
    portCancelButton: queryRequired('#cancel_add_port'),
    timeModal: queryRequired('#time-modal'),
    timeInput: /** @type {HTMLInputElement} */ (queryRequired('#time-input')),
    timeConfirmButton: queryRequired('#confirm-time'),
    timeCancelButton: queryRequired('#cancel-time'),
    deleteOverlay: queryRequired('.delete-dialog'),
    deleteConfirmButton: queryRequired('#accept-delete'),
    deleteCancelButton: queryRequired('#cancel-delete'),
    signalOverlay: queryRequired('.alert-overlay'),
    signalContinueButton: queryRequired('.alert-card__continue'),
    signalDisableButton: queryRequired('.alert-card__disable'),
    notification: queryRequired('.notification'),
    notificationTitle: queryRequired('.notification__title'),
    notificationMessage: queryRequired('.notification__message'),
    notificationClose: queryRequired('.notification__close'),
    timerDisplay: queryRequired('#time'),
    timerStatus: queryRequired('#add-time'),
    timerPlayButton: queryRequired('#timer-play'),
    timerPresets: queryRequired('#frequent-times'),
    activeModules: queryRequired('#activeModules'),
    additionalCharge: queryRequired('#additionalCharge'),
    voltage: queryRequired('#voltage'),
    batteryValue: queryRequired('#value_battery'),
    batteryFill: queryRequired('#battery-fill'),
    signalingOne: queryRequired('#signaling1'),
    signalingTwo: queryRequired('#signaling2'),
    signalingThree: queryRequired('#signaling3'),
    signalingFour: queryRequired('#signaling4'),
    verticalChart: /** @type {HTMLCanvasElement} */ (queryRequired('#verticalChart')),
    horizontalChart: /** @type {HTMLCanvasElement} */ (queryRequired('#horizontalChart')),
  };
}

/**
 * @param {Element} container
 * @param {ReadonlyArray<{ label: string }>} labels
 */
function hydrateFrequencyLabels(container, labels) {
  const labelNodes = queryAll('.frequency-toggle__label', container);

  labelNodes.forEach((node, index) => {
    node.textContent = labels[index]?.label ?? '';
  });
}

/**
 * @param {DashboardElements} elements
 * @param {ReadonlyArray<{ label: string }>} [labels]
 */
function hydrateLabels(elements, labels = VERTICAL_FREQUENCIES) {
  const defaultLabels = labels.length >= 8 ? labels : VERTICAL_FREQUENCIES;
  const verticalLabels = defaultLabels.slice(0, 8);
  const horizontalLabels = HORIZONTAL_FREQUENCIES;
  const combinedLabels = COMBINED_FREQUENCIES;

  hydrateFrequencyLabels(elements.verticalSection, verticalLabels);
  hydrateFrequencyLabels(elements.horizontalSection, horizontalLabels);
  hydrateFrequencyLabels(elements.combinedGroup, combinedLabels);
}

/**
 * @param {number} seconds
 * @returns {string}
 */
function formatPreset(seconds) {
  if (seconds === 0) {
    return '0 сек';
  }

  if (seconds % 60 === 0) {
    return `${seconds / 60} мин`;
  }

  return `${seconds} сек`;
}

/**
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatCountdown(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(clamped / 60)).padStart(2, '0');
  const seconds = String(clamped % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * @param {DashboardElements} elements
 * @param {DashboardView} view
 */
function applyView(elements, view) {
  currentView = view;

  try {
    localStorage.setItem(STORAGE_VIEW_KEY, view);
  } catch {
    // Storage can be unavailable in some embedded environments.
  }

  const showManual = view === 'manual';
  const showModes = view === 'modes';
  const showCustom = view === 'custom';

  setHidden(elements.modeSwitcher, !showManual);
  setHidden(elements.combinedGroup, showManual);
  setHidden(elements.modeDrawer, !showModes);
  setHidden(elements.customMode, !showCustom);
  setHidden(elements.cancelButton, showManual);
  setHidden(elements.backButton, showManual);
  setHidden(elements.createButton, !showCustom);
  setHidden(elements.nextButton, true);

  setActive(elements.manualButton, showManual);
  setActive(elements.modesButton, !showManual);
}

/**
 * @param {DashboardElements} elements
 * @param {string} title
 * @param {string} message
 * @param {'info' | 'success' | 'warning' | 'danger'} [tone]
 */
function showNotification(elements, title, message, tone = 'info') {
  const notification = elements.notification;
  notification.dataset.tone = tone;

  setText(elements.notificationTitle, title);
  setText(elements.notificationMessage, message);
  setHidden(notification, false);

  window.clearTimeout(notificationTimer);
  notificationTimer = window.setTimeout(() => {
    setHidden(notification, true);
  }, 2600);
}

/**
 * @param {DashboardElements} elements
 */
function hydrateTimerPresets(elements) {
  elements.timerPresets.replaceChildren();

  TIMER_PRESETS.forEach((seconds) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'time-presets__button button button--ghost';
    button.dataset.seconds = String(seconds);
    button.textContent = formatPreset(seconds);
    elements.timerPresets.append(button);
  });

  elements.timerPresets.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const seconds = Number(target.dataset.seconds ?? '0');
    setValue(elements.timeInput, String(seconds));
    setText(elements.timerStatus, `Выбрано: ${formatPreset(seconds)}`);
    setText(elements.timerDisplay, formatCountdown(seconds));
  });
}

/**
 * @param {DashboardElements} elements
 */
function hydrateFanState(elements) {
  const fanValue = elements.fanStatus.textContent?.trim();
  if (!fanValue || fanValue === '--') {
    setText(elements.fanStatus, 'Выкл');
  }

  const buttonValue = elements.disableFanButton.textContent?.trim();
  if (!buttonValue) {
    setText(elements.disableFanButton, 'Отключить');
  }
}

/**
 * @param {DashboardElements} elements
 */
function hydrateTelemetry(elements) {
  if (!elements.timerDisplay.textContent?.trim()) {
    setText(elements.timerDisplay, '00:00');
  }

  if (!elements.timerStatus.textContent?.trim()) {
    setText(elements.timerStatus, 'Выберите пресет');
  }

  const defaultMarker = '--';
  [
    elements.activeModules,
    elements.additionalCharge,
    elements.voltage,
    elements.signalingOne,
    elements.signalingTwo,
    elements.signalingThree,
    elements.signalingFour,
    elements.batteryValue,
  ].forEach((element) => {
    const text = element.textContent?.trim();
    if (!text || text === defaultMarker) {
      setText(element, defaultMarker);
    }
  });

  if (!elements.batteryFill.style.width) {
    elements.batteryFill.style.width = '38%';
  }
}

/**
 * @param {DashboardElements} elements
 */
function renderBridgeSnapshot(elements) {
  /**
   * @param {ReadonlyArray<{ id: string; label: string }>} checkboxes
   */
  const applyCheckboxLabels = (checkboxes) => {
    if (checkboxes.length < 16) {
      return;
    }

    const verticalLabels = checkboxes.slice(0, 8);
    const horizontalLabels = checkboxes.slice(8, 16);

    hydrateFrequencyLabels(elements.verticalSection, verticalLabels);
    hydrateFrequencyLabels(elements.horizontalSection, horizontalLabels);
    hydrateFrequencyLabels(elements.combinedGroup, verticalLabels);
  };

  /**
   * @param {Record<string, unknown>} payload
   */
  const applyTelemetry = (payload) => {
    const mapping = {
      additionalCharge: elements.additionalCharge,
      activeModules: elements.activeModules,
      voltage: elements.voltage,
      fan1: elements.fanStatus,
      battery: elements.batteryValue,
      batteryValue: elements.batteryValue,
      signaling1: elements.signalingOne,
      signaling2: elements.signalingTwo,
      signaling3: elements.signalingThree,
      signaling4: elements.signalingFour,
    };

    Object.entries(mapping).forEach(([key, element]) => {
      const value = payload[key];
      if (typeof value === 'string' || typeof value === 'number') {
        setText(element, String(value));
      }

      if (key === 'battery' || key === 'batteryValue') {
        const numericValue =
          typeof value === 'number' ? value : Number.parseFloat(typeof value === 'string' ? value : '');

        if (Number.isFinite(numericValue)) {
          const clamped = Math.max(0, Math.min(100, numericValue));
          elements.batteryFill.style.width = `${clamped}%`;
          setText(elements.batteryValue, `${clamped}%`);
        }
      }

    });
  };

  return {
    applyCheckboxLabels,
    applyTelemetry,
  };
}

/**
 * @param {DashboardElements} elements
 */
function wireModeControls(elements) {
  elements.manualButton.addEventListener('click', () => {
    applyView(elements, 'manual');
    showNotification(elements, 'Режим изменён', 'Переключение на ручное управление.', 'success');
  });

  elements.modesButton.addEventListener('click', () => {
    applyView(elements, 'modes');
    showNotification(elements, 'Режимы', 'Открылся список предустановок.', 'info');
  });

  elements.customButton.addEventListener('click', () => {
    applyView(elements, 'custom');
    showNotification(elements, 'Кастомный режим', 'Настройте интервал и набор частот.', 'info');
  });

  elements.cancelButton.addEventListener('click', () => {
    applyView(elements, 'manual');
  });

  elements.backButton.addEventListener('click', () => {
    applyView(elements, currentView === 'custom' ? 'modes' : 'manual');
  });

  elements.createButton.addEventListener('click', () => {
    const name = elements.customNameInput.value.trim() || 'Без названия';
    const seconds = Number(elements.customTimeInput.value || '0');
    const enabledModes = ['custom1', 'custom2', 'custom3']
      .map((id) => document.getElementById(id))
      .filter((node) => node instanceof HTMLInputElement && node.checked)
      .map((node) => node.id);

    showNotification(
      elements,
      'Кастомный режим создан',
      `${name} · ${formatPreset(seconds)} · ${enabledModes.length} опций`,
      'success',
    );
    applyView(elements, 'manual');
  });

  queryAll('.mode-drawer__button').forEach((button) => {
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    button.addEventListener('click', () => {
      const command = button.dataset.command ?? button.textContent?.trim() ?? 'm ?';
      showNotification(elements, 'Предустановка выбрана', `Команда: ${command}`, 'info');
    });
  });
}

/**
 * @param {DashboardElements} elements
 */
function wireActions(elements) {
  elements.applyButton.addEventListener('click', () => {
    const checkedInputs = queryAll('input[type="checkbox"]')
      .filter((input) => input instanceof HTMLInputElement && input.checked)
      .length;

    showNotification(elements, 'Применено', `Активных переключателей: ${checkedInputs}`, 'success');
  });

  elements.addPortButton.addEventListener('click', () => {
    openOverlay(queryRequired('.overlay--ports'));
    setValue(elements.portInput, localStorage.getItem(STORAGE_PORT_KEY) ?? elements.portInput.value);
  });

  elements.timerPlayButton.addEventListener('click', () => {
    openOverlay(elements.timeModal);
    setValue(elements.timeInput, elements.timeInput.value || '0');
  });

  elements.portCancelButton.addEventListener('click', () => {
    closeOverlay(queryRequired('.overlay--ports'));
  });

  elements.portConfirmButton.addEventListener('click', () => {
    const port = elements.portInput.value.trim();

    if (!port) {
      showNotification(elements, 'Порт не задан', 'Введите имя COM-порта или путь.', 'warning');
      return;
    }

    try {
      localStorage.setItem(STORAGE_PORT_KEY, port);
    } catch {
      // localStorage may be blocked.
    }

    setText(elements.connectionStatus, `Порт: ${port}`);
    showNotification(elements, 'Порт сохранён', port, 'success');
    closeOverlay(queryRequired('.overlay--ports'));
  });

  elements.timeInput.addEventListener('input', () => {
    const seconds = Number(elements.timeInput.value || '0');
    setText(elements.timerDisplay, formatCountdown(seconds));
  });

  elements.timeConfirmButton.addEventListener('click', () => {
    const seconds = Number(elements.timeInput.value || '0');
    setText(elements.timerDisplay, formatCountdown(seconds));
    setText(elements.timerStatus, `Установлено: ${formatPreset(seconds)}`);
    showNotification(elements, 'Таймер обновлён', `Автовыключение через ${formatPreset(seconds)}`, 'success');
    closeOverlay(elements.timeModal);
  });

  elements.timeCancelButton.addEventListener('click', () => {
    closeOverlay(elements.timeModal);
  });

  elements.emergencyButton.addEventListener('click', () => {
    openOverlay(elements.signalOverlay);
    setText(queryRequired('#timer'), 'Аварийная остановка активна');
  });

  elements.signalContinueButton.addEventListener('click', () => {
    closeOverlay(elements.signalOverlay);
  });

  elements.signalDisableButton.addEventListener('click', () => {
    setText(elements.fanStatus, 'Выкл');
    setText(elements.disableFanButton, 'Включить');
    closeOverlay(elements.signalOverlay);
    showNotification(elements, 'Блок модулей выключен', 'Аварийный сценарий завершён.', 'warning');
  });

  elements.deleteCancelButton.addEventListener('click', () => {
    closeOverlay(elements.deleteOverlay);
  });

  elements.deleteConfirmButton.addEventListener('click', () => {
    closeOverlay(elements.deleteOverlay);
    showNotification(elements, 'Удалено', 'Кастомный режим удалён.', 'success');
  });

  elements.disableFanButton.addEventListener('click', () => {
    const isEnabled = elements.fanStatus.textContent?.trim() === 'Вкл';
    setText(elements.fanStatus, isEnabled ? 'Выкл' : 'Вкл');
    setText(elements.disableFanButton, isEnabled ? 'Отключить' : 'Включить');
    showNotification(
      elements,
      'Вентилятор',
      isEnabled ? 'Вентилятор включён.' : 'Вентилятор отключён.',
      isEnabled ? 'success' : 'warning',
    );
  });

  elements.notificationClose.addEventListener('click', () => {
    setHidden(elements.notification, true);
  });
}

/**
 * @param {DashboardElements} elements
 */
function connectBridge(elements) {
  if (window.location.protocol !== 'file:') {
    return;
  }

  if (
    bridgeSocket &&
    (bridgeSocket.readyState === WebSocket.OPEN || bridgeSocket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  try {
    bridgeSocket = new WebSocket(`ws://127.0.0.1:${BRIDGE_PORT}`);
  } catch {
    const storedPort = localStorage.getItem(STORAGE_PORT_KEY);
    setText(elements.connectionStatus, storedPort ? `Порт: ${storedPort}` : 'Не подключен');
    return;
  }

  const bridgeSnapshot = renderBridgeSnapshot(elements);

  bridgeSocket.addEventListener('open', () => {
    setText(elements.connectionStatus, 'Сервер подключён');
  });

  bridgeSocket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(String(event.data));
      /** @type {BridgeMessage} */
      const bridgeMessage = message;

      if (bridgeMessage.type === 'hello') {
        const payload = /** @type {Record<string, unknown> & { serialPortPath?: string; config?: { serialPort?: string; checkboxes?: Array<{ id: string; label: string }> } }} */ (
          bridgeMessage.payload
        );

        const serialPortPath =
          typeof payload.serialPortPath === 'string' && payload.serialPortPath.trim()
            ? payload.serialPortPath.trim()
            : typeof payload.config?.serialPort === 'string' && payload.config.serialPort.trim()
              ? payload.config.serialPort.trim()
              : '';

        if (serialPortPath) {
          setText(elements.connectionStatus, `Порт: ${serialPortPath}`);
        }

        if (payload.config?.checkboxes) {
          bridgeSnapshot.applyCheckboxLabels(payload.config.checkboxes);
        }
      }

      if (bridgeMessage.type === 'state' && typeof bridgeMessage.payload === 'object' && bridgeMessage.payload !== null) {
        bridgeSnapshot.applyTelemetry(bridgeMessage.payload);
      }
    } catch {
      // Ignore non-JSON bridge messages.
    }
  });

  bridgeSocket.addEventListener('error', () => {
    bridgeSocket = null;
    const storedPort = localStorage.getItem(STORAGE_PORT_KEY);
    setText(elements.connectionStatus, storedPort ? `Порт: ${storedPort}` : 'Не подключен');
  });

  bridgeSocket.addEventListener('close', () => {
    bridgeSocket = null;
    const storedPort = localStorage.getItem(STORAGE_PORT_KEY);
    setText(elements.connectionStatus, storedPort ? `Порт: ${storedPort}` : 'Не подключен');
  });
}

function openOverlay(overlay) {
  setHidden(overlay, false);
}

/**
 * @param {HTMLElement} overlay
 */
function closeOverlay(overlay) {
  setHidden(overlay, true);
}

export function initializeDashboard() {
  const elements = collectElements();

  hydrateLabels(elements);
  hydrateTimerPresets(elements);
  hydrateFanState(elements);
  hydrateTelemetry(elements);
  renderMonitoringCharts(elements.verticalChart, elements.horizontalChart);
  wireModeControls(elements);
  wireActions(elements);

  const storedView = /** @type {DashboardView | null} */ (localStorage.getItem(STORAGE_VIEW_KEY));
  applyView(elements, storedView === 'modes' || storedView === 'custom' ? storedView : 'manual');

  const storedPort = localStorage.getItem(STORAGE_PORT_KEY);
  if (storedPort) {
    setText(elements.connectionStatus, `Порт: ${storedPort}`);
    setValue(elements.portInput, storedPort);
  } else {
    setText(elements.connectionStatus, 'Не подключен');
  }

  connectBridge(elements);
}
