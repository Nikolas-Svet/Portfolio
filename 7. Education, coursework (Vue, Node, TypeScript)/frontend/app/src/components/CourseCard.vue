// --------------------------------------------------
// src/components/CourseCard.vue
<template>
  <div class="course-card" @click="$emit('select', course)">
    <img :src="VITE_API_URL+'/'+course.image" alt="{{ course.title }}" class="card-img" />
    <div class="card-content">
      <h3 class="card-title">{{ course.title }}</h3>
      <p class="card-meta">{{ course.category }} | {{ course.level }}</p>
      <p v-if="course.description" class="card-desc">{{ course.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { ICourse } from '@/types/course'

const { VITE_API_URL } = import.meta.env

const props = defineProps<{ course: ICourse }>()
const emit = defineEmits<{
  (e: 'select', course: ICourse): void
}>()
</script>

<style scoped lang="scss">
.course-card {
  display: flex;
  flex-direction: column;
  background: $primary-white;
  border: none;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    filter: brightness(85%);
  }
}
.course-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.card-content {
  padding: 16px;
}
.card-title {
  margin: 0;
  font-size: 18px;
  font-family: $Golos_Text_Medium;
}
.card-meta {
  margin: 8px 0;
  font-size: 16px;
  font-family: $Golos_Text_Regular;
  color: $primary-text-color;
}
</style>
