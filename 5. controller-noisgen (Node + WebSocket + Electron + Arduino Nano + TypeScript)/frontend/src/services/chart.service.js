// @ts-check

/**
 * @typedef {import('../types/dashboard.js').ChartSeries} ChartSeries
 * @typedef {import('../types/dashboard.js').ChartTheme} ChartTheme
 */

const VERTICAL_SERIES = [18, 24, 20, 29, 33, 38, 35, 41, 46, 44, 52, 49];
const HORIZONTAL_SERIES = [14, 17, 22, 25, 23, 31, 34, 37, 39, 45, 48, 51];

/** @type {ChartTheme} */
const DEFAULT_THEME = {
  background: 'rgba(9, 13, 28, 0.65)',
  grid: 'rgba(167, 185, 255, 0.12)',
  axis: 'rgba(255, 255, 255, 0.36)',
};

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {{ width: number; height: number; ratio: number }}
 */
function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(220, Math.floor(rect.height));
  const ratio = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  return { width, height, ratio };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 */
function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/**
 * @param {ChartSeries} series
 * @returns {number}
 */
function getMinimum(series) {
  return Math.min(...series.values) - 6;
}

/**
 * @param {ChartSeries} series
 * @returns {number}
 */
function getMaximum(series) {
  return Math.max(...series.values) + 6;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {ChartSeries} series
 * @param {Partial<ChartTheme>} [themeOverrides]
 */
export function drawLineChart(canvas, series, themeOverrides = {}) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const { width, height, ratio } = resizeCanvas(canvas);
  const theme = { ...DEFAULT_THEME, ...themeOverrides };
  const padding = { top: 28, right: 18, bottom: 34, left: 42 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const min = getMinimum(series);
  const max = getMaximum(series);
  const xStep = chartWidth / Math.max(series.values.length - 1, 1);
  const yRange = Math.max(max - min, 1);

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, theme.background);
  background.addColorStop(1, 'rgba(6, 10, 22, 0.84)');

  roundedRect(ctx, 0, 0, width, height, 24);
  ctx.fillStyle = background;
  ctx.fill();

  ctx.save();
  ctx.translate(padding.left, padding.top);

  ctx.lineWidth = 1;
  ctx.strokeStyle = theme.grid;

  for (let row = 0; row <= 4; row += 1) {
    const y = (chartHeight / 4) * row;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
    ctx.stroke();
  }

  for (let column = 0; column <= Math.max(series.values.length - 1, 1); column += 1) {
    const x = xStep * column;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, chartHeight);
    ctx.stroke();
  }

  const points = series.values.map((value, index) => ({
    x: index * xStep,
    y: chartHeight - ((value - min) / yRange) * chartHeight,
  }));

  const fill = ctx.createLinearGradient(0, 0, 0, chartHeight);
  fill.addColorStop(0, series.fill);
  fill.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, chartHeight);
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.lineTo(point.x, point.y);
      return;
    }

    const previous = points[index - 1];
    const cpX = previous.x + (point.x - previous.x) / 2;
    ctx.bezierCurveTo(cpX, previous.y, cpX, point.y, point.x, point.y);
  });
  ctx.lineTo(points[points.length - 1].x, chartHeight);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point, index) => {
    if (index === 0) {
      return;
    }

    const previous = points[index - 1];
    const cpX = previous.x + (point.x - previous.x) / 2;
    ctx.bezierCurveTo(cpX, previous.y, cpX, point.y, point.x, point.y);
  });
  ctx.lineWidth = 3;
  ctx.strokeStyle = series.stroke;
  ctx.shadowColor = series.stroke;
  ctx.shadowBlur = 14;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = series.stroke;
  points.forEach((point, index) => {
    if (index !== points.length - 1) {
      return;
    }

    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = theme.axis;
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillText(series.label, 0, -10);

  ctx.restore();
}

/**
 * @param {HTMLCanvasElement} verticalCanvas
 * @param {HTMLCanvasElement} horizontalCanvas
 */
export function renderMonitoringCharts(verticalCanvas, horizontalCanvas) {
  const redraw = () => {
    drawLineChart(verticalCanvas, {
      label: 'Вертикальная поляризация',
      values: VERTICAL_SERIES,
      stroke: '#7cf5c6',
      fill: 'rgba(124, 245, 198, 0.24)',
    });

    drawLineChart(horizontalCanvas, {
      label: 'Горизонтальная поляризация',
      values: HORIZONTAL_SERIES,
      stroke: '#57a6ff',
      fill: 'rgba(87, 166, 255, 0.24)',
    });
  };

  redraw();

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {
      redraw();
    });

    observer.observe(verticalCanvas);
    observer.observe(horizontalCanvas);
    window.addEventListener(
      'beforeunload',
      () => {
        observer.disconnect();
      },
      { once: true },
    );
    return;
  }

  window.addEventListener('resize', redraw);
}
