<script lang="ts" setup>
import { reactive, ref } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import {authApi} from "@/api/auth.ts";
import {Base} from "@/utils/consts.ts";

interface FormFields {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  repeat_password: string;
  role: string;
}

const form = reactive<FormFields>({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  repeat_password: '',
  role: Base.student
});

const router = useRouter();

const fields = [
  { name: 'firstName', label: 'Имя', type: 'text' },
  { name: 'lastName', label: 'Фамилия', type: 'text' },
  { name: 'username', label: 'Логин', type: 'text' },
  { name: 'password', label: 'Пароль', type: 'password' },
  { name: 'repeat_password', label: 'Повторите пароль', type: 'password' },
];

const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';

  for (const key in form) {
    if (!form[key as keyof FormFields]) {
      errorMessage.value = 'Пожалуйста, заполните все поля';
      return;
    }
  }

  if (form.password !== form.repeat_password) {
    errorMessage.value = 'Пароли не совпадают';
    return;
  }

  // Удалим repeat_password перед отправкой, если нужно
  const { repeat_password, ...safeForm } = form;
  const res = await authApi.SignUp(form.firstName, form.lastName, form.username, form.password, form.role);
  console.log(res);
  if (res.success) {
    router.push('/sign-in/');
  } else if (res.error.message) {
    errorMessage.value = res.error.message;
  } else {
    errorMessage.value = 'Ошибка при попытке зарегистрироваться';
  }
};
</script>

<template>
  <section class="SignUp">
    <div class="SignUp__left">
      <img alt="Signup background" src="@/assets/images/SignUp/background.webp" />
    </div>

    <form class="SignUp__right" @submit.prevent="handleSubmit">
      <div class="SignUp__title">
        <div class="SignUp__logo">
          <img alt="NikCourse logo" src="@/assets/images/logo.svg" />
        </div>
        <h1>NikCourse</h1>
      </div>

      <h3 class="SignUp__subtitle">
        Присоединяйтесь к нам. Николас обещает хранить ваши данные в безопасности.
      </h3>

      <div v-for="field in fields" :key="field.name" class="SignUp__group">
        <label :for="field.name">{{ field.label }}</label>
        <BaseInput
          :id="'reg-' + field.name"
          v-model="form[field.name as keyof FormFields]"
          :name="field.name"
          :type="field.type"
        />
      </div>

      <div class="SignUp__group">
        <label for="reg-role">Роль</label>
        <BaseSelect
          id="reg-role"
          v-model="form.role"
          :options="[
            { value: Base.student, label: 'Студент' },
            { value: Base.teacher, label: 'Преподаватель' },
          ]"
          name="role"
        />
      </div>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <button type="submit">Зарегистрироваться</button>
    </form>
  </section>
</template>

<style lang="scss" scoped>
$primary-radius-login: 15px;

.form-error {
  color: red;
  margin-top: 16px;
  font-family: $Golos_Text_Medium;
  font-weight: 500;
  font-size: 16px;
}

.SignUp {
  width: 100%;
  background-color: $primary-white;
  border-radius: $primary-radius-login;
  display: flex;

  &__left {
    transition: all 0.3s ease;
    width: 50%;
    height: 586px;

    img {
      width: 100%;
      border-radius: $primary-radius-login 0 0 $primary-radius-login;
      height: 100%;
    }
  }

  &__right {
    width: 50%;
    transition: all 0.3s ease;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    button {
      margin-top: 16px;
      width: 100%;
      border-radius: 8px;
      height: 41px;
      background-color: $primary-green;
      border: none;
      color: $primary-white;
      font-family: $Golos_Text_Medium;
      font-size: 16px;
      transition: all 0.5s ease;
      &:hover {
        box-shadow: 0 0 10px rgba(61, 203, 177, 0.6);
      }
    }
  }

  &__title {
    text-decoration: none;
    max-width: 140px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    h1 {
      font-family: $Golos_Text_Medium;
      font-weight: 500;
      font-size: 20px;
      color: $primary-text-color;
    }
  }

  &__logo {
    height: 34px;
    width: 34px;

    img {
      height: 100%;
      width: 100%;
    }
  }

  &__subtitle {
    font-family: $Golos_Text_Regular;
    font-weight: 400;
    font-size: 16px;
    opacity: 0.6;
    line-height: 1.4;
    color: $primary-text-color;
    margin-bottom: 12px;
  }

  &__group {
    width: 100%;
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;

    label {
      font-size: 12px;
      font-family: $Golos_Text_Regular;
      font-weight: 400;
      opacity: 0.6;
      line-height: 1.4;
      color: $primary-text-color;
    }
  }
}
</style>
