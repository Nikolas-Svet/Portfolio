<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { userApi } from '@/api/user'
import type { UserProfile } from '@/api/user'
import defaultAvatar from '@/assets/images/user.svg'
import {Base} from "@/utils/consts.ts";

const user = ref<UserProfile | null>(null)
const loading = ref(true)
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const avatarUrl = ref<string>(defaultAvatar)

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

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
  loading.value = false
})

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files && target.files[0]
  if (!file) return
  const res = await userApi.updatePhoto(file)
  if (res.success && res.data) {
    user.value = res.data
    if (res.data.photo) {
      const path = res.data.photo.startsWith('/') ? res.data.photo : `/${res.data.photo}`
      avatarUrl.value = `${BASE_URL}${path}`
    } else {
      avatarUrl.value = defaultAvatar
    }
  } else {
    alert(res.error || 'Ошибка загрузки изображения')
  }
}

function triggerUpload() {
  fileInput.value?.click()
}
</script>

<template>
  <section class="User">
    <div class="User__content">
      <div v-if="loading" class="User__loading">Загрузка...</div>
      <div v-else-if="error" class="User__error">{{ error }}</div>
      <div v-else class="User__profile container__main">
        <div class="User__avatar-wrapper">
          <img :src="avatarUrl" alt="Avatar" class="User__avatar" />
          <button class="User__upload-btn" @click="triggerUpload">Загрузить фото</button>
          <input
            ref="fileInput"
            accept="image/*"
            class="User__file-input"
            type="file"
            @change="onFileChange"
          />
        </div>
        <div class="User__info">
          <p><strong>Имя:</strong> {{ user?.firstName }}</p>
          <p><strong>Фамилия:</strong> {{ user?.lastName }}</p>
          <p><strong>Роль:</strong> {{ user?.role === Base.teacher ? 'Преподаватель' : 'Ученик' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.User {
  height: calc(100dvh - 379px);

  &__content {
    margin-top: 32px;
    padding: 32px;
    background-color: $primary-white;
    border-radius: 15px;
    width: 100%;
  }

  &__loading,
  &__error {
    text-align: center;
    font-size: 18px;
    padding: 20px;
    color: $primary-text-color;
  }

  &__profile {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  &__avatar-wrapper {
    position: relative;
    width: 150px;
    height: 150px;

    .User__avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid $primary-gray;
    }

    .User__upload-btn {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 12px;
      font-size: 14px;
      cursor: pointer;
      border: none;
      background-color: $primary-green;
      color: white;
      border-radius: 4px;
    }

    .User__file-input {
      display: none;
    }
  }

  &__info {
    flex: 1;

    p {
      margin: 8px 0;
      font-size: 16px;
      color: $primary-text-color;
      font-family: $Golos_Text_Regular;
      font-weight: 400;

      strong {
        font-family: $Golos_Text_Medium;
        color: $primary-text-color;
      }
    }
  }
}
</style>
