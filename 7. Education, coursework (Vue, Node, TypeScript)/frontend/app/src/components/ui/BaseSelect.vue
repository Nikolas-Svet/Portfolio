<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
  id: String,
  name: String,
  options: {
    type: Array as () => { label: string; value: string }[],
    required: true,
  },
  required: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <select
    :id="id"
    :name="name"
    :value="modelValue"
    :required="required"
    @change="updateValue"
    class="base-select"
  >
    <option disabled value="">Выберите значение</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped lang="scss">
.base-select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid $primary-black-opacity;
  color: $primary-text-color;
}
</style>
