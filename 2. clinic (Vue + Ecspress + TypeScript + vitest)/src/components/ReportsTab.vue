<template>
  <div>
    <div class="report-tabs" role="tablist" aria-label="Отчеты">
      <button
        v-for="tab in reportTabs"
        :key="tab.id"
        class="report-tab"
        :class="{ active: tab.id === reportTab }"
        role="tab"
        :aria-selected="tab.id === reportTab"
        @click="reportTab = tab.id"
      >
        {{ tab.title }}
      </button>
    </div>

    <div v-if="reportTab === 'daily'" class="report-panel">
      <DailyReport />
    </div>

    <div v-else-if="reportTab === 'monthly'" class="report-panel">
      <MonthlyReport />
    </div>

    <div v-else class="report-panel placeholder">
      <div>
        <h3>Скоро здесь</h3>
        <p>Добавим {{ reportTab === 'daily' ? "дневные" : "недельные" }} отчеты.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DailyReport from "./DailyReport.vue";
import MonthlyReport from "./MonthlyReport.vue";

const reportTabs = [
  { id: "daily", title: "Дневной отчёт" },
  { id: "weekly", title: "Недельные" },
  { id: "monthly", title: "Месячные" }
];
const reportTab = ref("monthly");
</script>

<style scoped>
.report-tabs {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.report-tab {
  border: 1px solid rgba(8, 105, 166, 0.2);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}

.report-tab.active {
  border-color: #4fb68e;
  box-shadow: 0 10px 24px rgba(79, 182, 142, 0.2);
}

.report-panel {
  margin-top: 20px;
}

.placeholder {
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(79, 182, 142, 0.12), rgba(8, 105, 166, 0.12));
  border: 1px dashed rgba(8, 105, 166, 0.2);
}

.placeholder h3 {
  margin-top: 0;
}
</style>
