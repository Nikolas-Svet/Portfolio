<template>
  <div class="app-shell">
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-grid"></div>

    <div class="shell-frame">
      <AppHeader />

      <main class="layout">
        <AppSidebar />

        <section class="panel">
          <div class="panel-content">
            <RouterView />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "./AppHeader.vue";
import AppSidebar from "./AppSidebar.vue";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap");

:global(body) {
  margin: 0;
  background: #ffffff;
}

.app-shell {
  --mint: #4fb68e;
  --deep: #0869a6;
  --ink: #0c1c2c;
  --fog: rgba(8, 105, 166, 0.08);
  --glass: rgba(255, 255, 255, 0.78);
  font-family: "Space Grotesk", sans-serif;
  min-height: 100vh;
  color: var(--ink);
  position: relative;
  overflow: hidden;
}

.bg-orb {
  position: absolute;
  border-radius: 999px;
  opacity: 0.6;
  z-index: 0;
}

.orb-1 {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(79, 182, 142, 0.5), rgba(79, 182, 142, 0));
  top: -120px;
  left: -100px;
}

.orb-2 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(8, 105, 166, 0.45), rgba(8, 105, 166, 0));
  bottom: -220px;
  right: -180px;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--fog) 1px, transparent 1px),
    linear-gradient(90deg, var(--fog) 1px, transparent 1px);
  background-size: 42px 42px;
  opacity: 0.5;
  z-index: 0;
}

.shell-frame {
  position: relative;
  z-index: 1;
  padding: 0 32px 32px;
}

.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.panel {
  min-width: 0;
  min-height: calc(100vh - 168px);
  background: var(--glass);
  border: 1px solid rgba(8, 105, 166, 0.14);
  border-radius: 28px;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(8, 105, 166, 0.12);
}

.panel-content {
  padding: 32px;
}

@media (max-width: 1024px) {
  .shell-frame {
    padding: 0 20px 24px;
  }

  .layout {
    grid-template-columns: 1fr;
  }

  .panel {
    min-height: auto;
  }

  .panel-content {
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .panel-content {
    padding: 20px;
  }
}
</style>
