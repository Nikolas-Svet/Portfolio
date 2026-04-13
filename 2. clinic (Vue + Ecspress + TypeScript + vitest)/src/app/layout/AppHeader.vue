<template>
  <header class="topbar">
    <div class="brand">
      <div class="logo-mark">CL</div>
      <div>
        <h1>Clinic Desk</h1>
        <p class="subtitle">Единая консоль клиники</p>
      </div>
    </div>

    <div class="status-card">
      <div class="status-title">Системный статус</div>
      <div class="status-row">
        <span class="dot" :class="healthStatusClass"></span>
        <span>{{ healthLabel }}</span>
      </div>
      <button class="ghost" @click="checkHealth" :disabled="loading">
        {{ loading ? "Проверяем..." : "Проверить API" }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getHealth } from "../../api/health";

const healthStatus = ref<"unknown" | "ok" | "error">("unknown");
const loading = ref(false);

const healthLabel = computed(() => {
  if (loading.value) return "Проверяем соединение";
  if (healthStatus.value === "ok") return "API доступен";
  if (healthStatus.value === "error") return "API недоступен";
  return "Не проверено";
});

const healthStatusClass = computed(() => ({
  ok: healthStatus.value === "ok",
  error: healthStatus.value === "error",
  idle: healthStatus.value === "unknown" || loading.value
}));

async function checkHealth() {
  loading.value = true;
  try {
    const data = await getHealth();
    healthStatus.value = data.status === "ok" ? "ok" : "error";
  } catch (err) {
    healthStatus.value = "error";
    throw err;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 32px 0 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-mark {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, var(--mint), var(--deep));
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 16px 32px rgba(8, 105, 166, 0.16);
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.subtitle {
  margin: 4px 0 0;
  color: rgba(12, 28, 44, 0.7);
  font-size: 14px;
}

.status-card {
  background: var(--glass);
  border: 1px solid rgba(8, 105, 166, 0.15);
  border-radius: 18px;
  padding: 16px 20px;
  min-width: 220px;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(8, 105, 166, 0.12);
}

.status-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: rgba(12, 28, 44, 0.6);
  margin-bottom: 8px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-weight: 500;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(12, 28, 44, 0.25);
  box-shadow: 0 0 0 6px rgba(12, 28, 44, 0.06);
}

.dot.ok {
  background: #4fb68e;
  box-shadow: 0 0 0 6px rgba(79, 182, 142, 0.16);
}

.dot.error {
  background: #e15151;
  box-shadow: 0 0 0 6px rgba(225, 81, 81, 0.14);
}

.ghost {
  background: transparent;
  border: 1px solid rgba(8, 105, 166, 0.35);
  color: #0869a6;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
}

.ghost:disabled {
  opacity: 0.7;
  cursor: progress;
}

@media (max-width: 1024px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
    padding: 24px 0 18px;
  }

  .status-card {
    min-width: 0;
  }
}
</style>
