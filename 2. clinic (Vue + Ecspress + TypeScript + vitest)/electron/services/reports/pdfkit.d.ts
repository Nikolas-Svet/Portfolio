declare module "pdfkit" {
  import { EventEmitter } from "node:events";

  type TextAlign = "left" | "right" | "center" | "justify";

  type PDFMargins = {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  type PDFDocumentOptions = {
    autoFirstPage?: boolean;
    bufferPages?: boolean;
    compress?: boolean;
    margin?: number;
    margins?: PDFMargins;
    size?: string | [number, number];
  };

  type PDFTextOptions = {
    width?: number;
    align?: TextAlign;
    lineBreak?: boolean;
  };

  export default class PDFDocument extends EventEmitter {
    constructor(options?: PDFDocumentOptions);
    addPage(options?: PDFDocumentOptions): this;
    currentLineHeight(includeGap?: boolean): number;
    end(): void;
    fillColor(color: string): this;
    font(src: string): this;
    font(src: string, size: number): this;
    fontSize(size: number): this;
    heightOfString(text: string, options?: PDFTextOptions): number;
    registerFont(name: string, src?: string, family?: string): this;
    text(text: string, x?: number, y?: number, options?: PDFTextOptions): this;
    on(event: "data", listener: (chunk: Buffer | Uint8Array) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    rect(x: number, y: number, width: number, height: number): this;
    fill(color?: string): this;
    page: {
      width: number;
      height: number;
      margins: PDFMargins;
    };
    x: number;
    y: number;
  }
}
