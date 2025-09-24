// src/views/SearchCourses.vue
<template>
  <div class="SearchCourses__wrap"></div>
  <section class="SearchCourses">
    <p class="SearchCourses__title">Чему вы хотите научиться?</p>
    <div class="SearchCourses__filter">
      <div class="SearchCourses__item">
        <BaseInput v-model="filter.title" placeholder="Поиск по названию" />
      </div>
      <div class="SearchCourses__item">
        <BaseVSelect
          v-model="filter.category"
          :options="categories"
          placeholder="Выберите категорию"
        />
      </div>
      <div class="SearchCourses__item">
        <BaseInput v-model="filter.priceMin" placeholder="Мин. цена" type="number" />
      </div>
      <div class="SearchCourses__item">
        <BaseInput v-model="filter.priceMax" placeholder="Макс. цена" type="number" />
      </div>
    </div>

    <div class="courses-list">
      <div
        v-if="user?.role !== Base.teacher"
        v-for="course in courses"
        :key="course._id"
        class="course-card"
        @click="openCourse(course)"
      >
        <img :alt="course.title" :src="imageUrl(course.image)" class="course-card__img" />
        <div class="course-card__content">
          <h4>{{ course.title }}</h4>
          <button @click.stop.prevent="enrollCourse(course._id)">Записаться на курс</button>
        </div>
      </div>
      <p v-else>Для преподавателей запись на курс не достпуна</p>
    </div>

    <div class="pagination">
      <button :disabled="filter.page === 1" @click="filter.page--"></button>
      <span>{{ filter.page }} / {{ pages }}</span>
      <button :disabled="filter.page === pages" @click="filter.page++"></button>
    </div>

    <Modal v-if="showDetail" @close="showDetail = false">
      <template #header>{{ detailCourse.title }}</template>
      <template #body>
        <div class="сourse-modal">
          <img
            :alt="detailCourse.title"
            :src="imageUrl(detailCourse.image)"
            class="course-card__img"
          />
          <div>
            <p>{{ detailCourse.description }}</p>
            <h5>Уроки курса:</h5>
            <ul v-if="lessons.length">
              <li v-for="lesson in lessons" :key="lesson._id">
                {{ lesson.title }}
              </li>
            </ul>
            <p v-else>-</p>
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn primary" @click="enrollCourse(detailCourse._id)">
          Записаться на курс
        </button>
      </template>
    </Modal>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { coursesApi } from '@/api/courses'
import { lessonsApi } from '@/api/lesson'
import { enrollmentsApi } from '@/api/enrollments'
import type { ICourse } from '@/types/course'
import type { ILesson } from '@/types/lesson'
import { userApi } from '@/api/user.ts'
import {Base} from "@/utils/consts.ts";

const backendBase = import.meta.env.VITE_API_URL
type Filter = {
  title: string
  category: string
  priceMin?: number
  priceMax?: number
  page: number
  limit: number
}

const filter = reactive<Filter>({
  title: '',
  category: '',
  page: 1,
  limit: 3,
})
const imageUrl = (relative: string) =>
  `${backendBase}${relative.startsWith('/') ? '' : '/'}${relative}`
const categories = ref<string[]>([])
const courses = ref<ICourse[]>([])
const total = ref(0)
const pages = computed(() => Math.ceil(total.value / filter.limit))

const showDetail = ref(false)
const detailCourse = ref<ICourse>({} as ICourse)
const lessons = ref<ILesson[]>([])

const user = ref<any>(null)

onMounted(async () => {
  const resCat = await coursesApi.getCategories()
  if (resCat.success) categories.value = resCat.data.categories || resCat.data
  await fetchCourses()

  const res = await userApi.getProfile()
  if (res.success && res.data) {
    user.value = res.data
  }
})

async function fetchCourses() {
  const res = await coursesApi.getCourses({ ...filter })
  if (res.success) {
    courses.value = res.data.data
    total.value = res.data.total
  }
}

watch(
  [
    () => filter.title,
    () => filter.category,
    () => filter.priceMin,
    () => filter.priceMax,
    () => filter.page,
  ],
  fetchCourses,
)

async function openCourse(course: ICourse) {
  detailCourse.value = course
  // Загрузить уроки по курсу
  const res = await lessonsApi.getLessons()
  if (res.success && res.data) {
    lessons.value = res.data.filter((l) => l.course === course._id)
  }
  showDetail.value = true
}

async function enrollCourse(courseId: string) {
  const res = await enrollmentsApi.enroll(courseId)
  if (res.success) {
    alert('Вы успешно записаны на курс!')
    showDetail.value = false
  } else {
    alert(res.error)
  }
}
</script>

<style lang="scss" scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  background: $primary-gray;
  color: $primary-white;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  background: $primary-green;
  margin: 0 8px;
}

.сourse-modal {
  display: flex;

  img {
    height: 300px;
    width: 200px;
    border-radius: 8px;
  }

  div {
    margin-left: 32px;
  }

  p {
    font-size: 20px;
    font-family: $Golos_Text_Medium;
  }

  h5 {
    font-size: 16px;
    font-family: $Golos_Text_Regular;
  }

  ul {
    padding-left: 16px;
    list-style-type: none;
    font-size: 16px;
    font-family: $Golos_Text_Regular;
  }
}

.SearchCourses {
  position: relative;
  z-index: 1;
  margin-bottom: 32px;

  &__filter {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .SearchCourses__item {
    flex: 1;
  }

  .courses-list {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
  }

  .course-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: calc(33% - 21px);
    aspect-ratio: 3/4;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 24px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      .course-card__content {
        height: 60px;
      }
    }

    &__content {
      width: 100%;
      overflow: hidden;
      height: 30px;
      transition: height 0.3s ease;
    }

    h4,
    p,
    button {
      color: $primary-white;
      position: relative;
    }

    h4 {
      font-size: 20px;
      font-family: $Golos_Text_Medium;
      margin-bottom: 8px;
    }

    p {
      font-size: 16px;
      font-family: $Golos_Text_Regular;
      margin-bottom: 8px;
    }

    button {
      border: none;
      background-color: transparent;
      font-size: 16px;
      font-family: $Golos_Text_Medium;
    }

    img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      border-radius: 8px;
      z-index: 0;
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    span {
      font-family: $Golos_Text_Medium;
      font-size: 16px;
      color: $primary-text-color;
    }

    button {
      height: 30px;
      width: 30px;
      position: relative;
      background-color: transparent;
      border: none;

      &:hover {
        opacity: 0.9;
      }

      &:after,
      &:before {
        content: '';
        position: absolute;
        width: 3px;
        height: 16px;
        background-color: $primary-green;
      }

      &:after {
        transform: translate(-50%, -50%) rotate(-55deg);
        top: 65%;
        border-radius: 2px;
      }

      &:before {
        transform: translate(-50%, -50%) rotate(55deg);
        top: 35%;
        border-radius: 2px;
      }

      &:last-child {
        transform: scaleX(-1);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.SearchCourses {
  width: 100%;
  padding: 32px;
  background-color: $primary-white;
  border-radius: 15px;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.07);
  margin-top: calc(-100dvh - 64px);
  position: relative;
  z-index: 1;

  &__wrap {
    content: '';
    position: sticky;
    top: 0;
    z-index: 0;
    height: 100dvh;
    width: 100dvw;
    background-color: $primary-green;
  }

  &__title {
    font-size: 20px;
    font-family: $Golos_Text_Medium;
    font-weight: 600;
    text-align: left;
    margin-bottom: 8px;
    color: $primary-text-color;
  }

  &__filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__item {
    width: 33%;
    height: 45px;

    input {
      height: 100%;
    }

    --vs-height: 100%;

    .v-select {
      height: 100%;
    }
  }
}
</style>
