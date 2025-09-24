<script setup lang="ts">
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth.ts';
import { useRouter } from 'vue-router';

const router = useRouter();


// Привязка данных к форме
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedRole = ref('');
const errorMessage = ref('');
const usernameError = ref(false); // Флаг ошибки для username

const fieldErrors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
});

// Функция отправки формы
const register = async () => {
  errorMessage.value = '';
  usernameError.value = false; // Сбрасываем ошибку перед отправкой

  fieldErrors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };

  if (password.value !== confirmPassword.value) {
    fieldErrors.value.confirmPassword = "Passwords do not match";
    return;
  }

  try {
    const response = await authApi.SignUp(username.value, password.value, email.value, selectedRole.value);

    if (response!.success) {
      router.push('/sign-in/');
    } else {
      // Распределяем ошибки по полям
      if (response!.error.username) {
        fieldErrors.value.username = response!.error.username[0];
      }
      if (response!.error.password) {
        fieldErrors.value.password = response!.error.password[0];
      }
      if (response!.error.role) {
        fieldErrors.value.role = response!.error.role[0];
      }

      // Если нет конкретных ошибок, показать общую ошибку
      if (!response!.error.username && !response!.error.password && !response!.error.role) {
        errorMessage.value = "Registration failed. Please check your inputs.";
      }
    }
  } catch (error) {
    errorMessage.value = "Unexpected error occurred.";
  }
};

const usernameClass = computed(() => ({
  'signup__input': true,
  'signup__invalid': fieldErrors.value.username
}));

const passwordClass = computed(() => ({
  'signup__input': true,
  'signup__invalid': fieldErrors.value.password
}));

const confirmPasswordClass = computed(() => ({
  'signup__input': true,
  'signup__invalid': fieldErrors.value.confirmPassword
}));

const roleClass = computed(() => ({
  'signup__select': true,
  'signup__invalid': fieldErrors.value.role
}));
</script>

<template>
  <section class="signup">
    <img src="@/assets/images/logo.webp" alt="Logo" class="signup__logo">
    <span class="signup__title">Create an Account</span>

    <form @submit.prevent="register" class="signup__form">
      <input v-model="username" type="text" placeholder="Username" :class="usernameClass">

      <input v-model="email" type="email" placeholder="Email" class="signup__input">
      <input v-model="password" type="password" placeholder="Password" :class="passwordClass">

      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" :class="confirmPasswordClass">
      <select v-model="selectedRole" id="role" :class="roleClass">
        <option disabled value="">Select a role</option>
        <option value="coach">Coach</option>
        <option value="assistant_1">Assistant Level 1</option>
        <option value="assistant_2">Assistant Level 2</option>
      </select>
      <p v-if="fieldErrors.role" class="error-message">{{ fieldErrors.role }}</p>

      <p v-if="fieldErrors.confirmPassword" class="error-message">{{ fieldErrors.confirmPassword }}</p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p v-if="fieldErrors.username" class="error-message">{{ fieldErrors.username }}</p>

      <button type="submit" class="signup__accept">Sign Up</button>
    </form>
  </section>
</template>

<style scoped lang="scss">
.error-message {
  font-family: $Inter-SemiBold;
  color: $primary-red;
  font-size: 16px;
  margin-top: 5px;
}
.signup {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;

  &__logo {
    width: 100%;
    max-width: 120px;
    height: 120px;
    margin-bottom: 65px;
  }

  &__invalid {
    transition: all 0.3s ease;
    border: 1px solid $primary-red !important;
    background-color: $primary-error !important;
  }

  &__title {
    width: 100%;
    text-align: center;
    align-content: center;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 20px;
    line-height: 1.2;
    color: $white-color;
    margin-bottom: 25px;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  &__input {
    height: 46px;
    width: 100%;
    border: none;
    padding: 0 12px;
    background-color: $white-color;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 18px;
    color: $black-color;
    line-height: 1.2;
    border-radius: 4px;
    transition: all 0.3s ease;
    &::placeholder {
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 18px;
      color: $black-color;
      line-height: 1.2;
    }
  }

  &__select {
    height: 46px;
    width: 100%;
    border: none;
    padding: 0 12px;
    font-family: $Inter-SemiBold;
    background-color: $white-color;
    font-weight: 600;
    font-size: 18px;
    color: $black-color;
    line-height: 1.2;
    border-radius: 4px;
    &::placeholder {
      font-family: $Inter-SemiBold;
      font-weight: 600;
      font-size: 18px;
      color: $black-color;
      line-height: 1.2;
    }
  }

  &__accept {
    margin-top: 12px;
    width: 100%;
    height: 46px;
    background-color: $primary-green;
    border: none;
    font-family: $Inter-SemiBold;
    font-weight: 600;
    font-size: 18px;
    color: $white-color;
    line-height: 1.2;
    border-radius: 8px;
    text-transform: uppercase;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>