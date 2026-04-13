import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBlobFile } from "./fileService";

describe("Сервис файлов", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("создаёт ссылку, запускает скачивание и освобождает blob URL", () => {
    const click = vi.fn();
    const remove = vi.fn();
    const link = {
      click,
      remove,
      href: "",
      download: ""
    };
    const appendChild = vi.fn();
    const createElement = vi.fn().mockReturnValue(link);
    const createObjectURL = vi.fn().mockReturnValue("blob:report");
    const revokeObjectURL = vi.fn();

    vi.stubGlobal("document", {
      createElement,
      body: { appendChild }
    });
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL
    });

    downloadBlobFile(new Blob(["report"]), "report.xlsx");

    expect(createElement).toHaveBeenCalledWith("a");
    expect(link.href).toBe("blob:report");
    expect(link.download).toBe("report.xlsx");
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(click).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:report");
  });
});
