// src/components/CourseModal.vue
<template>
  <Modal v-if="visible" @close="onClose">
    <template #header>Редактировать курс</template>
    <template #body>
      <form class="form" @submit.prevent="onSave">
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
      <button class="btn btn-delete" @click="onDelete">Удалить</button>
      <button class="btn primary" @click="onSave">Сохранить</button>
      <button class="btn" @click="onClose">Отмена</button>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Modal from './Modal.vue'
import type { CoursePayload } from '@/types/courses'
import { coursesApi } from '@/api/courses'
import type { ICourse } from '@/types/course'

const props = defineProps<{ visible: boolean; course: ICourse | null }>()
const emit = defineEmits<{
  (e: 'save', course: ICourse): void
  (e: 'close'): void
}>()


const form = ref<CoursePayload>({
  title: '',
  description: '',
  price: 0,
  category: '',
  level: 'beginner',
  published: false,
  tags: [],
})
const categories = ref<string[]>([])
let file: File | null = null

// При изменении переданного курса заполняем форму
watch(
  () => props.course,
  (c) => {
    if (c) {
      form.value = {
        title: c.title,
        description: c.description || '',
        price: c.price,
        category: c.category,
        level: c.level,
        published: c.published,
        tags: c.tags,
      }
    }
    file = null
  },
  { immediate: true },
)

// Загружаем категории при монтировании
onMounted(async () => {
  const res = await coursesApi.getCategories()
  if (res.success) categories.value = res.data.categories || res.data
})

function onFileChange(e: Event) {
  file = (e.target as HTMLInputElement).files?.[0] || null
}

async function onSave() {
  if (!props.course) return
  const payload: Partial<CoursePayload> = { ...form.value }
  if (file) payload.image = file
  const res = await coursesApi.updateCourse(props.course._id, payload)
  if (res.success) emit('save', res.data)
}

async function onDelete() {
  if (!props.course) return
  const res = await coursesApi.deleteCourse(props.course._id)
  emit('save', (res as any).data )
}

function onClose() {
  emit('close')
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

.btn-delete {
  margin-right: 16px;
  background: red;
  color: $primary-white;
}

</style>
