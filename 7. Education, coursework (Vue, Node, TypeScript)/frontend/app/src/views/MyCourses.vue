<template>
  <div class="my-courses">
    <h2 class="title">
      Мои курсы
    </h2>
    <div class="actions">
      <button class="add-btn" @click="showCreate = true">Добавить курс</button>
    </div>
    <div v-if="courses.length > 0" class="courses-grid">
      <CourseCard
        v-for="c in courses"
        :key="c._id"
        :course="c"
        @select="openEdit(c)"
      />
    </div>
    <div v-else class="no-courses">У вас пока нет курсов</div>

    <CourseModal
      :visible="showEdit"
      :course="selectedCourse"
      @save="onUpdate"
      @close="showEdit = false"
    />

    <CreateCourseModal
      :visible="showCreate"
      @create="onCreate"
      @close="showCreate = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { coursesApi } from '@/api/courses'
import CourseCard from '@/components/CourseCard.vue'
import CourseModal from '@/components/CourseModal.vue'
import CreateCourseModal from '@/components/CreateCourseModal.vue'
import type { ICourse } from '@/types/course'

const courses = ref<ICourse[]>([])
const selectedCourse = ref<ICourse | null>(null)
const showEdit = ref(false)
const showCreate = ref(false)

async function load() {
  const res = await coursesApi.getCoursesMy()
  if (res.success) {
    courses.value = Array.isArray(res.data.data) ? res.data.data : res.data
  }
}

function openEdit(course: ICourse) {
  selectedCourse.value = course
  showEdit.value = true
}

async function onUpdate() {
  showEdit.value = false
  await load()
}

async function onCreate() {
  showCreate.value = false
  await load()
}

onMounted(load)
</script>

<style scoped lang="scss">
.my-courses {
  padding: 32px 0 64px 0;
}
.title {
  font-size: 24px;
  margin-bottom: 16px;
  font-family: $Golos_Text_Medium;
  text-align: center;
  color: $primary-white;
}
.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.add-btn {
  background: $primary-white;
  color: $primary-green;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.no-courses {
  text-align: center;
  color: $primary-gray;
  font-size: 18px;
  padding: 32px 0;
}
</style>
