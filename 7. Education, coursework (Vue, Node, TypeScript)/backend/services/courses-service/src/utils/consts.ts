// src/utils/consts.ts
import dotenv from "dotenv";

dotenv.config();
const PREFIX = process.env.API_PREFIX;

export const API_PREFIX = PREFIX;

// Сообщения для фронта
export enum ErrorMessages {
    InternalServerError = 'Внутренняя ошибка сервера',
    // Получение данных о пользователе
    GetInfoNotAuth = 'Пользователь не авторизован',
    // Общее для пользователя
    NotFoundUser = 'Пользователь не найден',
    // Курсы
    NotFoundCourse = 'Курс не найден',
    ValidationId = 'Некорректный ID курса',
    CourseDelSuccessful = 'Курс успешно удалён',
    CourseNotFile = 'Требуется файл изображения',
}

