import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeDatePickerValue } from "../services/shared/dateTimeService";
import { withSetup, type WithSetupResult } from "../test/utils/withSetup";
import { useDailyReport } from "./useDailyReport";

const fixedNow = new Date(2026, 2, 21, 10, 15);

function createDeps() {
  return {
    downloadDailyReportPdf: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    pushToast: vi.fn<(message: string, type?: "error" | "info" | "success") => void>(),
    now: vi.fn<() => Date>().mockReturnValue(fixedNow)
  };
}

const scopes: Array<WithSetupResult<unknown>> = [];

function mountComposable(options?: Parameters<typeof useDailyReport>[0]) {
  const scope = withSetup(() => useDailyReport(options));
  scopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

describe("Composable дневного отчёта", () => {
  afterEach(async () => {
    vi.restoreAllMocks();

    while (scopes.length > 0) {
      await scopes.pop()?.cleanup();
    }
  });

  it("создаёт начальное состояние формы с текущей датой и нулями", () => {
    const deps = createDeps();
    const scope = mountComposable({ deps });

    expect(normalizeDatePickerValue(scope.result.form.date)).toBe("2026-03-21");
    expect(scope.result.form.ooo_cash).toBe(0);
    expect(scope.result.form.ooo_cashless).toBe(0);
    expect(scope.result.form.ip_cash).toBe(0);
    expect(scope.result.form.ip_cashless).toBe(0);
    expect(scope.result.canSubmit.value).toBe(true);
  });

  it("валидирует форму и делает submit недоступным при невалидных данных", () => {
    const deps = createDeps();
    const scope = mountComposable({ deps });

    scope.result.form.date = "";
    scope.result.form.ooo_cash = -1;

    expect(scope.result.canSubmit.value).toBe(false);
  });

  it("не отправляет невалидную форму", async () => {
    const deps = createDeps();
    const scope = mountComposable({ deps });

    scope.result.form.date = "";

    await scope.result.submit();

    expect(deps.downloadDailyReportPdf).not.toHaveBeenCalled();
    expect(deps.pushToast).not.toHaveBeenCalled();
  });

  it("выполняет submit flow и показывает success toast", async () => {
    const deps = createDeps();
    const captured: Array<Record<string, unknown>> = [];
    deps.downloadDailyReportPdf.mockImplementation(async (form) => {
      captured.push({ ...form });
    });

    const scope = mountComposable({ deps });
    scope.result.form.ooo_cash = 100;
    scope.result.form.ooo_cashless = 200;
    scope.result.form.ip_cash = 300;
    scope.result.form.ip_cashless = 400;

    await scope.result.submit();

    expect(captured).toEqual([
      {
        date: fixedNow,
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      }
    ]);
    expect(deps.pushToast).toHaveBeenCalledWith("Дневной отчет сформирован", "success");
    expect(scope.result.loading.value).toBe(false);
  });

  it("защищает от двойного submit и пробрасывает ошибку дальше", async () => {
    const deps = createDeps();
    const error = new Error("boom");
    let resolveRequest!: () => void;
    const request = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });
    deps.downloadDailyReportPdf.mockReturnValueOnce(request).mockRejectedValueOnce(error);

    const scope = mountComposable({ deps });

    const first = scope.result.submit();
    const second = scope.result.submit();
    expect(deps.downloadDailyReportPdf).toHaveBeenCalledTimes(1);

    resolveRequest();
    await first;
    await second;

    await expect(scope.result.submit()).rejects.toThrow(error);

    expect(deps.downloadDailyReportPdf).toHaveBeenCalledTimes(2);
    expect(deps.pushToast).not.toHaveBeenCalledWith(
      "Не удалось сформировать дневной отчет",
      "error"
    );
    expect(scope.result.loading.value).toBe(false);
  });
});
