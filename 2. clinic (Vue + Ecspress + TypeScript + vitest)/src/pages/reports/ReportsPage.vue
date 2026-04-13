<template>
  <section class="page">
    <header class="page-header">
      <h1>Отчеты</h1>
      <p class="page-description">
        Гибкая аналитика по услугам, врачам и периодам, экспорт в Excel.
      </p>
    </header>

    <div class="page-stack">
      <ReportsTab />
    </div>
  </section>
</template>

<script setup lang="ts">
import ReportsTab from "../../components/ReportsTab.vue";
</script>

<style scoped>
.page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: grid;
  gap: 8px;
}

h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  color: #0c1c2c;
}

.page-description {
  margin: 0;
  max-width: 720px;
  color: rgba(12, 28, 44, 0.68);
  font-size: 15px;
  line-height: 1.5;
}

.page-stack {
  display: grid;
  gap: 20px;
}
</style>
