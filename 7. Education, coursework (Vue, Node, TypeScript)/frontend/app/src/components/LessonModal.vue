// src/components/LessonModal.vue
<template>
  <Modal v-if="visible" @close="onClose">
    <template #header>Редактировать урок</template>
    <template #body>
      <form class="form" @submit.prevent="onSave">
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
      <button class="btn btn-delete" @click="onDelete">Удалить</button>
      <button class="btn primary" @click="onSave">Сохранить</button>
      <button class="btn" @click="onClose">Отмена</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Modal from './Modal.vue'
import { lessonsApi } from '@/api/lesson'
import type { LessonPayload } from '@/api/lesson'
import type { ICourse } from '@/types/course'
import { coursesApi } from '@/api/courses'
import type {ILesson} from "@/types/lesson.ts";

const props = defineProps<{ visible: boolean; lesson: ILesson | null }>()
const emit = defineEmits<{
  (e: 'save', lesson: ILesson): void
  (e: 'close'): void
}>()

// Формируем поля формы
const form = ref<LessonPayload>({ title: '', content: '', videoUrl: '', course: '', order: 0 })
const courses = ref<ICourse[]>([])

// При изменении lesson
watch(
  () => props.lesson,
  l => {
    if (l) {
      form.value = {
        title: l.title,
        content: l.content || '',
        videoUrl: l.videoUrl || '',
        course: l.course,
        order: l.order ?? 0
      }
    }
  }, { immediate: true }
)

// Загрузка списка курсов
onMounted(async () => {
  const res = await coursesApi.getCoursesMy()
  if (res.success) courses.value = Array.isArray(res.data.data) ? res.data.data : res.data
})

async function onSave() {
  if (!props.lesson) return
  const payload: Partial<LessonPayload> = { ...form.value }
  const res = await lessonsApi.updateLesson(props.lesson._id, payload)
  if (res.success && res.data) emit('save', res.data)
}

async function onDelete() {
  if (!props.lesson) return
  await lessonsApi.deleteLesson(props.lesson._id)
  emit('save', props.lesson)
}

function onClose() { emit('close') }
</script>

<style scoped lang="scss">
.form { display: flex; flex-direction: column; gap: 16px;
  &-group { display: flex; flex-direction: column; input, textarea, select { padding:8px; border:1px solid $primary-gray; border-radius:4px; } }
}
.btn { padding:0.5rem 1rem; border:none; background:$primary-gray; color:$primary-white; border-radius:4px; cursor:pointer; }
.btn.primary { background:$primary-green; margin:0 8px; }
.btn-delete { background:red; margin-right:8px; }
</style>
