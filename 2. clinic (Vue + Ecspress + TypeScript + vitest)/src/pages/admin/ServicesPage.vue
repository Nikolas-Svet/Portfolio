<template>
  <section class="page">
    <header class="page-header">
      <p class="page-kicker">Администрирование</p>
      <h1>Услуги</h1>
      <p class="page-description">
        Справочники, цены, категории врачей, типы услуг и настройки кабинетов.
      </p>
    </header>

    <div class="page-stack">
      <ServicesCrud />
    </div>
  </section>
</template>

<script setup lang="ts">
import ServicesCrud from "../../components/ServicesCrud.vue";
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

.page-kicker {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: rgba(12, 28, 44, 0.55);
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
