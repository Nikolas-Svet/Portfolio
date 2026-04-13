<template>
  <v-card class="report-card" elevation="0">
    <div class="report-header">
      <div>
        <h3>Дневной отчет</h3>
        <p>Сформируйте PDF-отчет по кассам ООО и ИП за выбранную дату.</p>
      </div>
    </div>

    <div class="report-form">
      <v-menu v-model="dateMenu" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-text-field label="Дата" :model-value="dateLabel" readonly v-bind="props" />
        </template>
        <v-date-picker v-model="form.date" />
      </v-menu>

      <div class="daily-grid">
        <div class="daily-group">
          <h4>Касса ООО</h4>

          <v-text-field
            v-model.number="form.ooo_cash"
            type="number"
            min="0"
            step="0.01"
            label="Наличные"
          />

          <v-text-field
            v-model.number="form.ooo_cashless"
            type="number"
            min="0"
            step="0.01"
            label="Безналичные"
          />
        </div>

        <div class="daily-group">
          <h4>Касса ИП</h4>

          <v-text-field
            v-model.number="form.ip_cash"
            type="number"
            min="0"
            step="0.01"
            label="Наличные"
          />

          <v-text-field
            v-model.number="form.ip_cashless"
            type="number"
            min="0"
            step="0.01"
            label="Безналичные"
          />
        </div>
      </div>

      <div class="report-actions">
        <v-btn color="primary" :loading="loading" :disabled="!canSubmit || loading" @click="submit">
          Скачать PDF
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDailyReport } from "../composables/useDailyReport";
import { normalizeDatePickerValue } from "../services/shared/dateTimeService";

const dateMenu = ref(false);
const { form, loading, canSubmit, submit } = useDailyReport();

const dateLabel = computed(() => normalizeDatePickerValue(form.date));
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
  flex-direction: column;
  gap: 16px;
}

.daily-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 16px;
}

.daily-group {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(232, 244, 255, 0.82));
  border: 1px solid rgba(8, 105, 166, 0.12);
  box-shadow: 0 10px 24px rgba(8, 105, 166, 0.08);
}

.daily-group h4 {
  margin: 0 0 12px;
}

.report-actions {
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 760px) {
  .daily-grid {
    grid-template-columns: 1fr;
  }
}
</style>
