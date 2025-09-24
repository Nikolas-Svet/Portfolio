<script setup lang="ts">
import vSelect from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  options: (string | number)[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <vSelect
    :options="props.options"
    :modelValue="props.modelValue"
    :placeholder="props.placeholder || 'Выберите значение'"
    @update:modelValue="(value: any) => emit('update:modelValue', value)"
    clearable
  />
</template>

<style lang="scss">
.v-select {
  * {
    font-family: $Golos_Text_Regular !important;
  }
  .vs__search {
    &::placeholder {
      color: $primary-black-opacity !important;
    }
  }
  .vs__dropdown-toggle {
    border: 1px solid $primary-black-opacity;
  }
  --vs-border: 1px solid $primary-black-opacity;
  --vs-border-radius: 6px;
  --vs-font-size: 14px;
}
.vs__dropdown-toggle {
  //border: 1px solid $primary-black-opacity !important;
}
</style>
