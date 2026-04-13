// @ts-check

import { initializeDashboard } from './services/dashboard.service.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard, { once: true });
} else {
  initializeDashboard();
}
