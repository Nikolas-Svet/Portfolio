import { computed, reactive, ref } from "vue";
import {
  createInitialDailyReportForm,
  downloadDailyReportPdf,
  isDailyReportFormValid
} from "../services/reports/reportService";
import { pushToast } from "../ui/toasts";

type DailyReportDeps = {
  downloadDailyReportPdf: typeof downloadDailyReportPdf;
  pushToast: typeof pushToast;
  now: () => Date;
};

export type UseDailyReportOptions = {
  deps?: Partial<DailyReportDeps>;
};

const defaultDeps: DailyReportDeps = {
  downloadDailyReportPdf,
  pushToast,
  now: () => new Date()
};

export function useDailyReport(options: UseDailyReportOptions = {}) {
  const deps: DailyReportDeps = { ...defaultDeps, ...options.deps };
  const loading = ref(false);
  const form = reactive(createInitialDailyReportForm(deps.now()));

  const canSubmit = computed(() => isDailyReportFormValid(form));

  async function submit() {
    if (!canSubmit.value || loading.value) return;

    loading.value = true;
    try {
      await deps.downloadDailyReportPdf(form);
      deps.pushToast("Дневной отчет сформирован", "success");
    } finally {
      loading.value = false;
    }
  }

  return {
    form,
    loading,
    canSubmit,
    submit
  };
}
