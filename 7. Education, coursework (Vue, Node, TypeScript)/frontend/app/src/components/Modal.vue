// src/components/Modal.vue
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <slot name="header" />
        <button class="close-btn" @click="close">×</button>
      </header>
      <section class="modal-body">
        <slot name="body" />
      </section>
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emit('close')
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-family: $Golos_Text_Medium;
  padding: 16px;
  border-bottom: 1px solid $primary-gray;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
}
.modal-body {
  font-size: 16px;
  font-family: $Golos_Text_Regular;
  line-height: 1.5;
  padding: 16px;
}
.modal-footer {
  padding: 16px;
  border-top: 1px solid $primary-gray;
  text-align: right;
}
</style>
