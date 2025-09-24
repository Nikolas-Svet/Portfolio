// src/components/LessonCard.vue
<template>
  <div class="lesson-card" @click="$emit('select', lesson)">
    <div class="card-content">
      <h3 class="card-title">{{ lesson.title }}</h3>
      <p class="card-meta">Курс: {{ courseMap[lesson.course] || '—' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { ILesson } from '@/types/lesson'
import type { ICourse } from '@/types/course'

const props = defineProps<{ lesson: ILesson; courses: ICourse[] }>()
const emit = defineEmits<{ (e: 'select', lesson: ILesson): void }>()

// Карта id->название курса
const courseMap = computed<Record<string,string>>(() => {
  const map: Record<string,string> = {}
  props.courses.forEach(c => map[c._id] = c.title)
  return map
})
</script>

<style scoped lang="scss">
.lesson-card {
  background: $primary-white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    filter: brightness(90%);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}
.card-content {
  .card-title { font-size: 18px; margin: 0 0 8px; }
  .card-meta  { font-size: 14px; color: $primary-text-color; }
}
</style>
