// src/utils/consts.ts

import dotenv from 'dotenv';
dotenv.config();
const PREFIX = process.env.API_PREFIX;

export const API_PREFIX = PREFIX;

// Сообщения для фронта
export enum ErrorMessages {
    InternalServerError = 'Внутренняя ошибка сервера',
    // Авторизация
    Auth = 'Неверный логин или пароль',
    AuthValidation = 'Логин и пароль обязательны',
    // Регистрация
    RegSuccessful = 'Пользователь зарегистрирован',
    RegValidationNickname = 'Пользователь с таким логином уже существует',
    RegValidationRole = 'Роль должна быть student или teacher',
    RegValidationAll = 'Все поля обязательны',
}

