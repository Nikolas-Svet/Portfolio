// src/views/MyLessons.vue
<template>
  <div class="my-lessons">
    <h2 class="title">Мои уроки</h2>
    <div class="actions">
      <button class="add-btn" @click="showCreate = true">Добавить урок</button>
    </div>
    <div v-if="lessons.length" class="lessons-grid">
      <LessonCard
        v-for="l in lessons"
        :key="l._id"
        :lesson="l"
        :courses="courses"
        @select="openEdit(l)"
      />
    </div>
    <div v-else class="no-lessons">У вас пока нет уроков</div>

    <LessonModal
      :visible="showEdit"
      :lesson="selectedLesson"
      @save="onUpdate"
      @close="showEdit = false"
    />

    <CreateLessonModal
      :visible="showCreate"
      @create="onCreate"
      @close="showCreate = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { lessonsApi } from '@/api/lesson'
import { coursesApi } from '@/api/courses'
import LessonCard from '@/components/LessonCard.vue'
import LessonModal from '@/components/LessonModal.vue'
import CreateLessonModal from '@/components/CreateLessonModal.vue'
import type { ILesson } from '@/types/lesson'
import type { ICourse } from '@/types/course'

const lessons = ref<ILesson[]>([])
const courses = ref<ICourse[]>([])
const selectedLesson = ref<ILesson | null>(null)
const showEdit = ref(false)
const showCreate = ref(false)

async function loadData() {
  const [lRes, cRes] = await Promise.all([
    lessonsApi.getLessons(),
    coursesApi.getCoursesMy()
  ])
  if (lRes.success && lRes.data) lessons.value = lRes.data
  if (cRes.success) courses.value = Array.isArray(cRes.data.data) ? cRes.data.data : cRes.data
}

function openEdit(lesson: ILesson) {
  selectedLesson.value = lesson
  showEdit.value = true
}

async function onUpdate() {
  showEdit.value = false
  await loadData()
}

async function onCreate() {
  showCreate.value = false
  await loadData()
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.my-lessons { padding:32px 0 64px; }
.title { font-size:24px; margin-bottom:16px; text-align:center; font-family:$Golos_Text_Medium; color:$primary-white; }
.actions { display:flex; justify-content:center; margin-bottom:16px; }
.add-btn { background:$primary-white; color:$primary-green; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;
  &:hover { opacity:0.9; }
}
.lessons-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }
.no-lessons { text-align:center; color:$primary-gray; font-size:18px; padding:32px 0; }
</style>
