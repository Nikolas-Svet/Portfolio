<template>
  <div class="toast-host" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
      <span>{{ toast.message }}</span>
      <button class="close" @click="removeToast(toast.id)">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { removeToast, useToasts } from "../ui/toasts";

const { toasts } = useToasts();
</script>

<style scoped>
.toast-host {
  position: fixed;
  top: 20px;
  right: 20px;
  display: grid;
  gap: 10px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid rgba(8, 105, 166, 0.2);
  border-left: 4px solid #0869a6;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(8, 105, 166, 0.14);
  min-width: 220px;
  font-size: 14px;
}

.toast.error {
  border-left-color: #e15151;
}

.toast.success {
  border-left-color: #4fb68e;
}

.toast.info {
  border-left-color: #0869a6;
}

.close {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(12, 28, 44, 0.6);
}
</style>
