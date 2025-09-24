// src/utils/consts.ts

import dotenv from "dotenv";

dotenv.config();
const PREFIX = process.env.API_PREFIX;

export const API_PREFIX = PREFIX;

// Сообщения для фронта
export enum ErrorMessages {
    InternalServerError = 'Внутренняя ошибка сервера',
    NotFound = 'Ресурс не найден',
    // Курсы
    ValidationId = 'Некорректный ID курса',

    // Комментарии
    CommentNotValidText = 'Сообщение пустое',
    CommentNotValidLessonUser = 'Нету такого урока или пользователя',
    CommentNotValidID = 'Некорректный ID комментария',
    CommentDeleteSuccessful = 'Некорректный ID комментария',
}

