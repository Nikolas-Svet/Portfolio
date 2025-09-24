// src/utils/consts.ts
import dotenv from "dotenv";

dotenv.config();
const PREFIX = process.env.API_PREFIX;

export const API_PREFIX = PREFIX;

// Сообщения для фронта
export enum ErrorMessages {
    InternalServerError = 'Внутренняя ошибка сервера',
    // Удаление пользователя
    delSuccessful = 'Пользователь удалён',
    // Получение данных о пользователе
    GetInfoNotAuth = 'Пользователь не авторизован',
    // Общее для пользователя
    NotFoundUser = 'Пользователь не найден',
}

