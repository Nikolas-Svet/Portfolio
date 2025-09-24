<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  id: String,
  name: String,
  placeholder: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :type="type"
    :id="id"
    :name="name"
    :value="modelValue"
    :placeholder="placeholder"
    @input="updateValue"
    class="base-input"
  />
</template>

<style scoped lang="scss">
.base-input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid $primary-black-opacity;
  color: $primary-text-color;
}
</style>
