// src/components/CreateCourseModal.vue
<template>
  <Modal v-if="props.visible" @close="onClose">
    <template #header>Добавить курс</template>
    <template #body>
      <form class="form" @submit.prevent="onCreate">
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Цена</label>
            <input v-model.number="form.price" required type="number" />
          </div>
          <div class="form-group">
            <label>Категория</label>
            <select v-model="form.category">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Уровень</label>
            <select v-model="form.level">
              <option value="beginner">Начальный</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
          <div class="form-group toggle">
            <label>Опубликован</label>
            <input v-model="form.published" type="checkbox" />
          </div>
        </div>
        <div class="form-group">
          <label>Изображение</label>
          <input type="file" @change="onFileChange" />
        </div>
      </form>
    </template>
    <template #footer>
      <button class="btn primary" @click="onCreate">Создать</button>
      <button class="btn" @click="onClose">Отмена</button>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Modal from './Modal.vue'
import { coursesApi } from '@/api/courses'
import type { CoursePayload } from '@/types/courses'
import type { ICourse } from '@/types/course.ts'

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  (e: 'create', course: ICourse): void
  (e: 'close'): void
}>()

const form = ref<CoursePayload>({
  title: '',
  price: 0,
  category: '',
  level: 'beginner',
  published: false,
  tags: [],
})
let file: File | null = null
const categories = ref<string[]>([])

onMounted(async () => {
  const res = await coursesApi.getCategories()
  if (res.success) categories.value = res.data.categories || res.data
})

function onFileChange(e: Event) {
  file = (e.target as HTMLInputElement).files?.[0] || null
}

function onClose() {
  emit('close')
}

async function onCreate() {
  if (file) form.value.image = file
  const res = await coursesApi.createCourse(form.value)
  if (res.success) emit('create', res.data)
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  &-group {
    display: flex;
    flex-direction: column;
  }

  &-row {
    display: flex;
    gap: 16px;
  }

  input {
    border: 1px solid $primary-gray;
    padding: 8px;
    max-width: 300px;
    border-radius: 4px;
  }
  textarea {
    border-radius: 4px;
    outline: none;
    border: 1px solid $primary-gray;
    padding: 8px;
    height: 200px;
    resize: none;
    max-width: 300px;
  }
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  background: $primary-gray;
  color: $primary-white;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  margin-right: 16px;
  background: $primary-green;
  color: $primary-white;
}
</style>
