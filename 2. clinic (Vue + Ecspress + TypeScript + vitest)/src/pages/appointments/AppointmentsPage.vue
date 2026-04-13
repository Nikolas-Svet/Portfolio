<template>
  <section class="page">
    <header class="page-header">
      <h1>Оформление приёма</h1>
      <p class="page-description">
        Быстрое создание приёма: выбор услуги, врача, цены и времени.
      </p>
    </header>

    <div class="page-stack">
      <AppointmentForm />
      <RecentAppointments />
    </div>
  </section>
</template>

<script setup lang="ts">
import AppointmentForm from "../../components/AppointmentForm.vue";
import RecentAppointments from "../../components/RecentAppointments.vue";
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
