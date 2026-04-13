import fs from "node:fs";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import type { DailyReportModel } from "./daily.js";

const a4Width = 595.28;
const a4Height = 841.89;
const leftMargin = 40;
const rightMargin = 40;
const topMargin = 52;
const bottomMargin = 46;
const titleFontSize = 20;
const sectionTitleFontSize = 14;
const bodyFontSize = 11;
const hintFontSize = 9;
const rowGap = 6;
const sectionGap = 10;
const quantityColumnWidth = 72;
const priceColumnWidth = 82;
const serviceColumnX = leftMargin + quantityColumnWidth + 12;
const serviceColumnWidth =
  a4Width - leftMargin - rightMargin - quantityColumnWidth - priceColumnWidth - 24;
const priceColumnX = a4Width - rightMargin - priceColumnWidth;
const reportFontName = "daily-report-font";
const bundledFontFileName = "OpenSans-Regular.ttf";
const bundledFontCandidates = [
  path.resolve(process.cwd(), "electron/services/reports/assets", bundledFontFileName),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "assets", bundledFontFileName),
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../electron/services/reports/assets",
    bundledFontFileName
  )
];
const moneyLabel = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

type DailyPdfState = {
  doc: PDFDocument;
  model: DailyReportModel;
  currentY: number;
};

export async function generateDailyReportPdfBuffer(model: DailyReportModel) {
  const fontPath = resolveBundledDailyPdfFontPath();
  const doc = new PDFDocument({
    autoFirstPage: false,
    bufferPages: false,
    compress: false,
    size: [a4Width, a4Height],
    margins: {
      top: topMargin,
      bottom: bottomMargin,
      left: leftMargin,
      right: rightMargin
    }
  });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer | Uint8Array) => {
    chunks.push(Buffer.from(chunk));
  });

  const endPromise = once(doc, "end");

  doc.registerFont(reportFontName, fontPath);

  const state: DailyPdfState = {
    doc,
    model,
    currentY: 0
  };

  startPage(state);

  if (model.doctors.length === 0) {
    ensureSpace(state, measureTextHeight(doc, "Приёмов за выбранную дату нет.", bodyFontSize));
    drawText(state, "Приёмов за выбранную дату нет.", leftMargin, state.currentY, {
      fontSize: bodyFontSize,
      width: a4Width - leftMargin - rightMargin
    });
    state.currentY += measureTextHeight(doc, "Приёмов за выбранную дату нет.", bodyFontSize) + 22;
  }

  for (const doctor of model.doctors) {
    renderDoctorSection(state, doctor);
  }

  renderCashBlock(state);

  doc.end();
  await endPromise;

  return Buffer.concat(chunks);
}

function resolveBundledDailyPdfFontPath() {
  for (const fontPath of bundledFontCandidates) {
    if (fs.existsSync(fontPath)) {
      return fontPath;
    }
  }

  throw new Error(`Unable to find bundled daily PDF font: ${bundledFontFileName}`);
}

function startPage(state: DailyPdfState) {
  const { doc, model } = state;
  doc.addPage();
  doc.rect(0, 0, a4Width, a4Height).fill("#FFFFFF");
  doc.fillColor("#000000");
  state.currentY = topMargin;

  const title = "Дневной отчёт";
  drawText(state, title, leftMargin, state.currentY, {
    fontSize: titleFontSize,
    width: a4Width - leftMargin - rightMargin
  });
  state.currentY += measureTextHeight(doc, title, titleFontSize) + 8;

  const dateLine = `Дата: ${model.dateLabel}`;
  drawText(state, dateLine, leftMargin, state.currentY, {
    fontSize: bodyFontSize,
    width: a4Width - leftMargin - rightMargin
  });
  state.currentY += measureTextHeight(doc, dateLine, bodyFontSize) + 18;
}

function renderDoctorSection(
  state: DailyPdfState,
  doctor: DailyReportModel["doctors"][number]
) {
  ensureSpace(state, measureDoctorHeaderHeight(state.doc, doctor.doctorName));
  renderDoctorHeader(state, doctor.doctorName);

  for (const row of doctor.rows) {
    const rowHeight = measureDoctorRowHeight(state.doc, row);

    if (!hasSpace(state, rowHeight + rowGap)) {
      startPage(state);
      renderDoctorHeader(state, doctor.doctorName);
    }

    renderDoctorRow(state, row);
    state.currentY += rowHeight + rowGap;
  }

  state.currentY += sectionGap;
}

function renderDoctorHeader(state: DailyPdfState, doctorName: string) {
  const { doc } = state;
  drawText(state, doctorName, leftMargin, state.currentY, {
    fontSize: sectionTitleFontSize,
    width: a4Width - leftMargin - rightMargin
  });
  state.currentY += measureTextHeight(doc, doctorName, sectionTitleFontSize) + 4;

  drawText(state, "Количество", leftMargin, state.currentY, {
    fontSize: hintFontSize,
    width: quantityColumnWidth
  });
  drawText(state, "Услуга", serviceColumnX, state.currentY, {
    fontSize: hintFontSize,
    width: serviceColumnWidth
  });
  drawText(state, "Цена", priceColumnX, state.currentY, {
    fontSize: hintFontSize,
    width: priceColumnWidth,
    align: "right"
  });
  state.currentY += measureTextHeight(doc, "Количество", hintFontSize, quantityColumnWidth) + 6;
}

function renderDoctorRow(
  state: DailyPdfState,
  row: DailyReportModel["doctors"][number]["rows"][number]
) {
  drawText(state, String(row.quantity), leftMargin, state.currentY, {
    fontSize: bodyFontSize,
    width: quantityColumnWidth,
    lineBreak: false
  });
  drawText(state, formatMoney(row.totalPrice), priceColumnX, state.currentY, {
    fontSize: bodyFontSize,
    width: priceColumnWidth,
    align: "right",
    lineBreak: false
  });
  drawText(state, row.serviceName, serviceColumnX, state.currentY, {
    fontSize: bodyFontSize,
    width: serviceColumnWidth
  });
}

function renderCashBlock(state: DailyPdfState) {
  const { doc, model } = state;
  const headerHeight = measureTextHeight(doc, "Кассовый блок", sectionTitleFontSize);
  const bodyHeights = model.cashEntries.map((entry) => measureTextHeight(doc, entry.label, bodyFontSize));
  const totalHeight = headerHeight + 6 + bodyHeights.reduce((sum, value) => sum + value + 6, 0);

  ensureSpace(state, totalHeight);
  drawText(state, "Кассовый блок", leftMargin, state.currentY, {
    fontSize: sectionTitleFontSize,
    width: a4Width - leftMargin - rightMargin
  });
  state.currentY += headerHeight + 6;

  for (const entry of model.cashEntries) {
    drawText(state, entry.label, leftMargin, state.currentY, {
      fontSize: bodyFontSize,
      width: a4Width - leftMargin - rightMargin - priceColumnWidth - 12
    });
    drawText(state, formatMoney(entry.value), priceColumnX, state.currentY, {
      fontSize: bodyFontSize,
      width: priceColumnWidth,
      align: "right",
      lineBreak: false
    });
    state.currentY += measureTextHeight(doc, entry.label, bodyFontSize) + 6;
  }
}

function ensureSpace(state: DailyPdfState, height: number) {
  if (!hasSpace(state, height)) {
    startPage(state);
  }
}

function hasSpace(state: DailyPdfState, height: number) {
  return state.currentY + height <= a4Height - bottomMargin;
}

function measureDoctorHeaderHeight(doc: PDFDocument, doctorName: string) {
  return (
    measureTextHeight(doc, doctorName, sectionTitleFontSize) +
    measureTextHeight(doc, "Количество", hintFontSize, quantityColumnWidth) +
    10
  );
}

function measureDoctorRowHeight(
  doc: PDFDocument,
  row: DailyReportModel["doctors"][number]["rows"][number]
) {
  const quantityHeight = measureTextHeight(
    doc,
    String(row.quantity),
    bodyFontSize,
    quantityColumnWidth
  );
  const priceHeight = measureTextHeight(doc, formatMoney(row.totalPrice), bodyFontSize, priceColumnWidth);
  const serviceHeight = measureTextHeight(doc, row.serviceName, bodyFontSize, serviceColumnWidth);

  return Math.max(quantityHeight, priceHeight, serviceHeight);
}

function measureTextHeight(doc: PDFDocument, text: string, fontSize: number, width?: number) {
  doc.font(reportFontName).fontSize(fontSize);
  return doc.heightOfString(text || " ", {
    width,
    align: "left"
  });
}

function drawText(
  state: DailyPdfState,
  text: string,
  x: number,
  y: number,
  options: {
    fontSize: number;
    width: number;
    align?: "left" | "right" | "center" | "justify";
    color?: string;
    lineBreak?: boolean;
  }
) {
  state.doc
    .font(reportFontName)
    .fontSize(options.fontSize)
    .fillColor(options.color ?? "#000000")
    .text(text, x, y, {
      width: options.width,
      align: options.align,
      lineBreak: options.lineBreak
    })
    .fillColor("#000000");
}

function formatMoney(value: number) {
  return moneyLabel.format(value);
}
