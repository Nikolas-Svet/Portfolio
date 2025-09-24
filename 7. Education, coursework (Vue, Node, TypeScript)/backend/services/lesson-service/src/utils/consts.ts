// src/utils/consts.ts
import dotenv from "dotenv";

dotenv.config();
const PREFIX = process.env.API_PREFIX;

export const API_PREFIX = PREFIX;

// Сообщения для фронта
export enum ErrorMessages {
    InternalServerError = 'Внутренняя ошибка сервера',
    NotFound = 'Ресурс не найден',
    // Уроки
    LessonNotValid = 'Имя и курс не заполнены',
    LessonNotValidID = 'Некорректный ID урока',
    LessonDeleteSuccessful = 'Некорректный ID урока',
}

