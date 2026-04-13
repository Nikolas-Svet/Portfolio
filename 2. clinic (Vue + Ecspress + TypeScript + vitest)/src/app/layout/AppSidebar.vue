<template>
  <aside class="sidebar">
    <section class="nav-card">
      <p class="section-label">Рабочие разделы</p>

      <RouterLink
        v-for="item in primaryItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ active: isActive(item.to) }"
      >
        <span class="nav-title">{{ item.title }}</span>
        <span class="nav-desc">{{ item.description }}</span>
      </RouterLink>
    </section>

    <section class="nav-card">
      <div class="section-head">
        <p class="section-label">Администрирование</p>
        <span class="section-hint">Справочники и настройки</span>
      </div>

      <RouterLink
        v-for="item in adminItems"
        :key="item.to"
        :to="item.to"
        class="admin-link"
        :class="{ active: isActive(item.to) }"
      >
        <span>{{ item.title }}</span>
      </RouterLink>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const primaryItems = [
  {
    to: "/appointments",
    title: "Оформление приёма",
    description: "Рабочий экран оператора"
  },
  {
    to: "/reports",
    title: "Отчеты",
    description: "Аналитика и выгрузки"
  }
];

const adminItems = [
  { to: "/admin/doctors", title: "Врачи" },
  { to: "/admin/services", title: "Услуги" },
  { to: "/admin/appointments", title: "Приёмы" }
];

function isActive(path: string) {
  return route.path === path;
}
</script>

<style scoped>
.sidebar {
  display: grid;
  gap: 18px;
}

.nav-card {
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(8, 105, 166, 0.14);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 14px 32px rgba(8, 105, 166, 0.1);
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-label {
  margin: 0 0 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: rgba(12, 28, 44, 0.55);
}

.section-hint {
  color: rgba(12, 28, 44, 0.48);
  font-size: 12px;
}

.nav-link,
.admin-link {
  display: grid;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  border-radius: 18px;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-link {
  padding: 14px;
  background: rgba(8, 105, 166, 0.04);
}

.nav-link + .nav-link,
.admin-link + .admin-link {
  margin-top: 10px;
}

.admin-link {
  padding: 12px 14px;
  background: rgba(8, 105, 166, 0.03);
  font-weight: 500;
}

.nav-link:hover,
.admin-link:hover {
  transform: translateY(-1px);
  background: rgba(8, 105, 166, 0.08);
}

.nav-link.active,
.admin-link.active {
  background: linear-gradient(135deg, rgba(79, 182, 142, 0.16), rgba(8, 105, 166, 0.12));
  box-shadow: inset 0 0 0 1px rgba(79, 182, 142, 0.26);
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
}

.nav-desc {
  color: rgba(12, 28, 44, 0.62);
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .sidebar {
    grid-template-columns: 1fr;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
