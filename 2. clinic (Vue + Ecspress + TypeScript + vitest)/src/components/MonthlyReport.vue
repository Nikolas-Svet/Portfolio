<template>
  <v-card class="report-card" elevation="0">
    <div class="report-header">
      <div>
        <h3>Месячный отчет</h3>
        <p>Сформируйте Excel-отчет по всем врачам за выбранный месяц.</p>
      </div>
    </div>

    <div class="report-form">
      <v-menu v-model="monthMenu" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-text-field label="Месяц" v-model="monthLabel" readonly v-bind="props" />
        </template>
        <v-date-picker v-model="selectedDate" />
      </v-menu>

      <v-switch v-model="rangeEnabled" color="success" label="Указать период" />

      <div v-if="rangeEnabled" class="range">
        <v-menu v-model="startMenu" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field label="С" v-model="rangeStart" readonly v-bind="props" />
          </template>
          <v-date-picker v-model="rangeStart" />
        </v-menu>

        <v-menu v-model="endMenu" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-text-field label="По" v-model="rangeEnd" readonly v-bind="props" />
          </template>
          <v-date-picker v-model="rangeEnd" />
        </v-menu>
      </div>

      <v-btn color="primary" :loading="loading" @click="download">
        Скачать Excel
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { monthRange, normalizeDatePickerValue } from "../services/shared/dateTimeService";
import { downloadBlobFile } from "../services/shared/fileService";
import {
  buildMonthlyReportQuery,
  buildReportFilename,
  fetchMonthlyReportBlob
} from "../services/reports/reportService";
import { pushToast } from "../ui/toasts";

const loading = ref(false);
const monthMenu = ref(false);
const startMenu = ref(false);
const endMenu = ref(false);
const selectedDate = ref<string | Date>(new Date());
const rangeEnabled = ref(false);
const rangeStart = ref<string | Date>(selectedDate.value);
const rangeEnd = ref<string | Date>(selectedDate.value);

const monthLabel = computed(() => {
  const normalizedDate = normalizeDatePickerValue(selectedDate.value);
  if (!normalizedDate) {
    return typeof selectedDate.value === "string" ? selectedDate.value : "";
  }

  const date = new Date(`${normalizedDate}T00:00:00`);
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(date);
});

watch(selectedDate, (value) => {
  const { start, end } = monthRange(value);
  if (!rangeEnabled.value) {
    rangeStart.value = start;
    rangeEnd.value = end;
  }
});

watch(rangeEnabled, (enabled) => {
  if (enabled) {
    const { start, end } = monthRange(selectedDate.value);
    rangeStart.value = start;
    rangeEnd.value = end;
  }
});

async function download() {
  loading.value = true;
  try {
    const query = buildMonthlyReportQuery(
      selectedDate.value,
      rangeEnabled.value,
      rangeStart.value,
      rangeEnd.value
    );
    const blob = await fetchMonthlyReportBlob(query);
    downloadBlobFile(blob, buildReportFilename(query.month));
    pushToast("Отчет сформирован", "success");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.report-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(8, 105, 166, 0.12);
}

.report-header h3 {
  margin: 0 0 4px;
}

.report-header p {
  margin: 0;
  color: rgba(12, 28, 44, 0.6);
  font-size: 13px;
}

.report-form {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.range {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
