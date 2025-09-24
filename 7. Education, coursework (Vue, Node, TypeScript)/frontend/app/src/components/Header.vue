<script lang="ts" setup>
import type { UserPayload } from '@/types/auth'
import UserIcon from '@/assets/images/user.svg'
import LogoIcon from '@/assets/images/logo.svg'
import ExitIcon from '@/assets/images/exit.svg'
import {Base, Routes} from "@/utils/consts.ts";
import Logo from "@/components/ui/Logo.vue";
import {userApi} from "@/api/user.ts";
import {ref} from "vue";
import defaultAvatar from "@/assets/images/user.svg";

const router = useRouter();

const { proxy } = getCurrentInstance()!
const stores = (proxy as any)?.$stores
const is_user = computed(() => stores.auth.isAuthenticated)
// const user = computed(() => stores.auth.user as UserPayload | null)

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

const avatarUrl = ref<string>('')

const user = ref<any>(null)
const error = ref('')

onMounted(async () => {
  const res = await userApi.getProfile()
  if (res.success && res.data) {
    user.value = res.data
    if (res.data.photo) {
      const path = res.data.photo.startsWith('/') ? res.data.photo : `/${res.data.photo}`
      avatarUrl.value = `${BASE_URL}${path}`
    }
  } else {
    error.value = (res.error as string) || 'Ошибка загрузки профиля'
  }
})

const logout = () => {
  localStorage.removeItem('token')
  router.push(Routes.login)
}
</script>

<template>
  <header class="container__main">
    <div class="content">
      <Logo/>
      <nav v-if="user?.role === Base.teacher" class="auth__actions--teacher">
        <router-link :to="Routes.my_courses">
          Мои курсы
        </router-link>
        <router-link :to="Routes.my_lessons">
          Мои уроки
        </router-link>
      </nav>
      <nav v-if="user?.role === Base.student" class="auth__actions--teacher">
        <router-link :to="Routes.my_enrollments">
          Мои курсы
        </router-link>
      </nav>
      <nav v-if="!is_user" class="auth__actions">
        <router-link :to="Routes.login">Авторизация</router-link>
        <router-link :to="Routes.register">Регистрация</router-link>
      </nav>
      <nav v-else class="auth__user">
        <router-link class="auth__info" :to="Routes.user">
          <img v-if="avatarUrl !== ''" :src="avatarUrl" alt="">
          <UserIcon v-else class="auth__info--icon"></UserIcon>
          <div class="auth__info--info">
            <span>{{ user?.lastName + ' ' + user?.firstName }}</span>
            <p>{{ user?.role === Base.teacher ? 'Преподаватель' : 'Ученик' }}</p>
          </div>
        </router-link>
        <button @click="logout" class="auth__logout">
          <ExitIcon></ExitIcon>
        </button>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  margin-top: 16px;
  width: 100%;
  position: sticky;
  top: 16px;
  z-index: 3;

  .content {
    border-radius: 15px;
    background-color: $primary-white;
    box-shadow: 0 8px 10px rgba(0, 0, 0, 0.17);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
  }

  .auth {
    &__actions {
      display: flex;
      max-width: 248px;
      width: 100%;
      align-items: center;
      justify-content: space-between;

      &--teacher {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 16px;
        a {
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          border-radius: 8px;
          font-family: $Golos_Text_Medium;
          color: $primary-text-color;
        }
      }

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        height: 32px;
        border-radius: 8px;
        font-family: $Golos_Text_Medium;

        &:first-child {
          background-color: transparent;
          width: 45%;
          border: 2px solid $primary-text-color;
          color: $primary-text-color;
          transition: all 0.3s ease;

          &:hover {
            background-color: $primary-text-color;
            color: $primary-white;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(35, 35, 35, 0.6);
          }
        }

        &:last-child {
          background-color: $primary-green;
          width: 45%;
          border: none;
          color: $primary-white;
          transition: all 0.5s ease;

          &:hover {
            box-shadow: 0 0 10px rgba(61, 203, 177, 0.6);
          }
        }
      }
    }

    &__user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      max-width: 300px;
    }

    &__logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 40px;
      width: 40px;
      padding: 0 6px;
      transition: all 0.3s ease;
      background-color: transparent;
      border: 2px solid $primary-text-color;
      border-radius: 50%;
      &:hover {
        border: 2px solid $primary-green;
        * {
          fill: $primary-green;
        }
      }
      svg {
        * {
          transition: all 0.3s ease;
          fill: $primary-text-color;
        }
      }
    }

    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        * {
          stroke: $primary-green;
          color: $primary-green;
        }
      }

      &--exit {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img {
        border-radius: 50%;
        height: 40px;
        width: 40px;
      }

      &--icon {
        height: 40px;
        width: 40px;

        * {
          transition: all 0.3s ease;
          stroke: $primary-text-color;
        }
      }

      &--info {
        margin-left: 10px;
        margin-right: 16px;

        p {
          transition: all 0.3s ease;
          font-family: $Golos_Text_Medium;
          font-size: 14px;
          color: $primary-text-color;
        }

        span {
          transition: all 0.3s ease;
          font-family: $Golos_Text_Medium;
          font-size: 16px;
          color: $primary-text-color;
        }
      }
    }
  }
}
</style>
