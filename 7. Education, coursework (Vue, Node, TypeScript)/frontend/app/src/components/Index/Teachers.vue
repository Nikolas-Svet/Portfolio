<template>
  <section class="Teachers">
    <h4 class="Teachers__title">Популярные преподаватели</h4>
    <span class="Teachers__subtitle">
      Мы знаем, что лучше всего подходит для вас. Лучшие подборки для вас.
    </span>

    <Carousel
      :items-to-show="3"
      :mouse-drag="false"
      :transition="500"
      :items-to-scroll="1"
      :wrap-around="false"
      class="Teachers__carousel"
    >
      <Slide v-for="teacher in teachers" :key="teacher._id">
        <div class="teacher-card">
          <img class="teacher-card__wrap" v-if="teacher.photo" :src="imageUrl(teacher.photo)" alt="">
          <p class="teacher-name">{{ teacher.firstName }} {{ teacher.lastName }}</p>
        </div>
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </section>
</template>

<script lang="ts" setup>
import { Carousel, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { userApi } from '@/api/user.ts'

interface ITeacher {
  _id: string
  firstName: string
  lastName: string
  photo?: string
}

const backendBase = import.meta.env.VITE_API_URL;
const imageUrl = (relativePath: string) => `${backendBase}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;

const teachers = ref<ITeacher[]>([])

onMounted(async () => {
  const res = await userApi.getTeachers()
  if (res.success && res.data) {
    teachers.value = res.data
    console.log(teachers)
  }
})
</script>

<style lang="scss">
:root {
  --vc-png-bottom: -30px !important;
}

.carousel__pagination {
  display: flex !important;
  align-items: flex-end;
  width: 100% !important;
  gap: 24px !important;
  li {
    width: 75px !important;
  }
  button {
    transition: all 0.3s ease !important;
    background-color: transparent !important;
    border-bottom: 4px solid $primary-black-opacity;
    height: 20px !important;

    &:hover {
      border-bottom: 7px solid $primary-green;
    }
  }
}
.carousel__pagination-button {
  width: 100% !important;
}
.carousel__pagination-button--active {
  border-bottom: 10px solid $primary-green !important;
}
</style>

<style lang="scss" scoped>
.Teachers {
  position: relative;
  z-index: 1;
  background-color: $primary-white;
  border-radius: 15px;
  padding: 32px 32px 64px 32px;
  width: 100%;
  margin-bottom: 64px;

  &__title {
    font-size: 20px;
    font-family: $Golos_Text_Medium;
    text-align: left;
    margin-bottom: 8px;
    color: $primary-text-color;
  }

  &__subtitle {
    font-size: 16px;
    font-family: $Golos_Text_Medium;
    text-align: left;
    margin-bottom: 16px;
    color: $primary-black-opacity;
    display: block;
  }

  &__carousel {
    margin-top: 24px;
  }
}

.teacher-card {
  background-color: $primary-green;
  width: calc(100% - 32px);
  aspect-ratio: 1/1.2;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    position: absolute;
    bottom: 16px;
    left: 16px;
    height: 0;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 1;
    font-family: $Golos_Text_Regular;
    color: $primary-white;
  }

  &:hover {
    cursor: pointer;
    &:after {
      border-radius: 15px;
      background-color: rgba(0, 0, 0, 0.2);
    }

    p {
      height: 20px;
    }
  }

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    transition: all 0.3s ease;
    background-color: transparent;
  }

  &__wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}

.teacher-name {
  font-weight: 600;
  font-size: 18px;
}
</style>
