// src/views/MyEnrollments.vue
<template>
  <div class="my-enrollments">
    <h2 class="title">Мои курсы</h2>
    <div v-if="enrollments.length" class="enrollments-grid">
      <div
        v-for="en in enrollments"
        :key="en._id"
        class="enrollment-card"
        @click="openEnrollment(en)"
      >
        <h3 class="course-title">{{ courses[en.course]?.title || 'Курс' }}</h3>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: en.progress + '%' }"
          ></div>
        </div>
        <p class="progress-text">Прогресс: {{ en.progress }}%</p>
      </div>
    </div>
    <div v-else class="no-enrollments">Вы ещё не записаны ни на один курс</div>

    <!-- Детали выбранной записи -->
    <Modal v-if="showDetail" @close="showDetail = false">
      <template #header>
        {{ courses[selectedEnrollment.course]?.title || 'Курс' }}
      </template>
      <template #body>
        <ul class="lessons-list">
          <li
            v-for="lesson in selectedCourseLessons"
            :key="lesson._id"
            class="lesson-item"
          >
            <label>
              <input
                type="checkbox"
                :checked="selectedEnrollment.completedLessons.includes(lesson._id)"
                @change="toggleLesson(lesson._id)"
              />
              {{ lesson.title }}
            </label>
          </li>
        </ul>
      </template>
      <template #footer>
        <button class="btn" @click="showDetail = false">Закрыть</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import { enrollmentsApi } from '@/api/enrollments'
import { coursesApi } from '@/api/courses'
import { lessonsApi } from '@/api/lesson'
import type { IEnrollment } from '@/types/enrollment'
import type { ICourse } from '@/types/course'
import type { ILesson } from '@/types/lesson'

const enrollments = ref<IEnrollment[]>([])
const courses = ref<Record<string, ICourse>>({})
const selectedEnrollment = ref<any>(null)
const selectedCourseLessons = ref<ILesson[]>([])
const showDetail = ref(false)

async function loadData() {
  const res = await enrollmentsApi.getEnrollments()
  if (res.success && res.data) {
    enrollments.value = res.data
    // загрузить данные о курсах
    await Promise.all(
      enrollments.value.map(async (en) => {
        if (!courses.value[en.course]) {
          const cRes = await coursesApi.getCourseById(en.course)
          if (cRes.success) courses.value[en.course] = cRes.data
        }
      })
    )
  }
}

onMounted(loadData)

async function openEnrollment(en: IEnrollment) {
  selectedEnrollment.value = en
  // загрузить уроки
  const lRes = await lessonsApi.getLessons()
  if (lRes.success && lRes.data) {
    selectedCourseLessons.value = lRes.data.filter(
      (l) => l.course === en.course
    )
  }
  showDetail.value = true
}

async function toggleLesson(lessonId: string) {
  const en = selectedEnrollment.value
  if (!en) return
  const completed = en.completedLessons.includes(lessonId)
  let res
  if (completed) {
    res = await enrollmentsApi.cancelLesson(en._id, lessonId)
  } else {
    res = await enrollmentsApi.completeLesson(en._id, lessonId)
  }
  if (res.success) {
    selectedEnrollment.value = res.data
    // обновить список
    const i = enrollments.value.findIndex((x) => x._id === en._id)
    if (i !== -1 && res.data) enrollments.value[i] = res.data
  }
}
</script>

<style scoped lang="scss">
.my-enrollments {
  padding: 32px 0 64px;
}
.title {
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
  color: $primary-white;
}
.enrollments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.enrollment-card {
  background: $primary-white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    filter: brightness(90%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .course-title {
    font-size: 18px;
    margin: 0 0 8px;
    color: $primary-text-color;
  }
  .progress-bar {
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
    height: 8px;
    margin-bottom: 8px;
  }
  .progress-fill {
    background: $primary-green;
    height: 100%;
    transition: width 0.3s;
  }
  .progress-text {
    font-size: 14px;
    color: $primary-text-color;
  }
}
.no-enrollments {
  text-align: center;
  color: $primary-gray;
  font-size: 18px;
  padding: 32px 0;
}
.lessons-list {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    margin-bottom: 8px;
  }
}
</style>
