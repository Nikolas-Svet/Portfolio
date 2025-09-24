// src/components/CreateLessonModal.vue
<template>
  <Modal v-if="props.visible" @close="onClose">
    <template #header>Создать урок</template>
    <template #body>
      <form class="form" @submit.prevent="onCreate">
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>Содержание</label>
          <textarea v-model="form.content" />
        </div>
        <div class="form-group">
          <label>Видео URL</label>
          <input v-model="form.videoUrl" />
        </div>
        <div class="form-group">
          <label>Курс</label>
          <select v-model="form.course">
            <option v-for="c in courses" :key="c._id" :value="c._id">{{ c.title }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Порядок</label>
          <input type="number" v-model.number="form.order" />
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn primary" @click="onCreate">Создать</button>
      <button class="btn" @click="onClose">Отмена</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from './Modal.vue'
import { lessonsApi } from '@/api/lesson'
import type { LessonPayload } from '@/api/lesson'
import type { ICourse } from '@/types/course'
import { coursesApi } from '@/api/courses'
import type {ILesson} from "@/types/lesson.ts";

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'create', lesson: ILesson): void
  (e: 'close'): void
}>()

const form = ref<LessonPayload>({ title: '', content: '', videoUrl: '', course: '', order: 0 })
const courses = ref<ICourse[]>([])

onMounted(async () => {
  const res = await coursesApi.getCoursesMy()
  if (res.success) courses.value = Array.isArray(res.data.data) ? res.data.data : res.data
})

function onClose() { emit('close') }

async function onCreate() {
  const res = await lessonsApi.createLesson(form.value)
  if (res.success && res.data) emit('create', res.data)
}
</script>

<style scoped lang="scss">
.form { display: flex; flex-direction: column; gap: 16px;
  &-group { display: flex; flex-direction: column; input, textarea, select { padding:8px; border:1px solid $primary-gray; border-radius:4px; } }
}
.btn { padding:0.5rem 1rem; border:none; background:$primary-gray; color:$primary-white; border-radius:4px; cursor:pointer; }
.btn.primary { background:$primary-green; }
</style>
