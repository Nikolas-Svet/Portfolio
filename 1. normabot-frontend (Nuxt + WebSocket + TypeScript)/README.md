# Normabot.Ai Frontend

Фронтенд-проект на основе [Nuxt 3](https://nuxt.com/). В этом файле описан стек технологий, структура проекта и инструкции по запуску.

---

## 🖥️ Стек технологий

* **Фреймворк:** Nuxt 3
* **Язык:** TypeScript
* **Стилизация:** SCSS с методологией БЭМ (Block\_\_Element--Modifier)
* **Линтинг и форматирование:**

    * ESLint
    * Stylelint
    * Prettier
* **Управление состоянием:** Pinia
* **Переменные среды:** файл `.env` (например, `VITE_API_URL`)

---

## 📂 Структура проекта

```bash
├── assets/
├── modules/              # Модульные компоненты страниц (BEM)
├── pages/                # Компоненты страниц Nuxt
│   ├── index.vue
├── .env                  # Переменные окружения
├── .eslintrc.js          # Конфигурация ESLint
├── .stylelintrc.json     # Конфигурация Stylelint
├── .prettierrc           # Конфигурация Prettier
├── tsconfig.json         # Основной TypeScript конфиг
├── nuxt.config.ts        # Конфигурация Nuxt
└── package.json
```

---

## ⚙️ Методология БЭМ

Формат именования **Two Dashes**:

```
block-name__elem-name--mod-name--mod-val
```

* Имена блоков и элементов — латиницей, в нижнем регистре, слова через `-`
* Элемент отделяется от блока двумя подчёркиваниями `__`
* Модификатор отделяется двумя дефисами `--`
* Булевые модификаторы без значения: `block-name--active`

---

## 🔧 Конфигурационные файлы

### ESLint (`.eslintrc.js`)

### Stylelint (`.stylelintrc.json`)

### Prettier (`.prettierrc`)

### TypeScript (`tsconfig.json`)

---

## 🚀 Запуск проекта

1. **Установить зависимости**

   ```bash
   npm install
   ```

2. **Создать и настроить `.env`**

   ```bash
   cp .env.example .env
   # Указать VITE_API_URL
   ```

3. **Запустить в режиме разработки**

   ```bash
   npm run dev
   ```
   Перейти: `http://localhost:3000`

---
