<template>
  <section class="crud-card">
    <header class="crud-header">
      <div>
        <h3>Врачи</h3>
        <p>Тип врача и полное имя.</p>
      </div>
      <button class="primary" @click="refresh" :disabled="loading">Обновить</button>
    </header>

    <form class="crud-form" @submit.prevent="submit">
      <div class="field">
        <label>Тип врача</label>
        <input v-model.trim="form.doctor_type" placeholder="Терапевт, Стоматолог" />
      </div>
      <div class="field">
        <label>ФИО</label>
        <input v-model.trim="form.full_name" placeholder="Иванова Мария Петровна" />
      </div>
      <div class="actions">
        <button class="primary" type="submit" :disabled="loading || !canSubmit">
          {{ editingId ? "Сохранить" : "Добавить" }}
        </button>
        <button v-if="editingId" class="ghost" type="button" @click="cancelEdit">
          Отмена
        </button>
      </div>
    </form>

    <div class="list">
      <div v-if="loading" class="hint">Загрузка...</div>
      <div v-else-if="doctors.length === 0" class="hint">Пока нет врачей.</div>
      <div v-else class="table">
        <div class="row header">
          <span>Тип</span>
          <span>ФИО</span>
          <span class="actions-col">Действия</span>
        </div>
        <div v-for="doc in doctors" :key="doc.id" class="row">
          <span>{{ doc.doctor_type }}</span>
          <span>{{ doc.full_name }}</span>
          <span class="actions-col">
            <button class="ghost" @click="startEdit(doc)">Изменить</button>
            <button class="danger" @click="remove(doc.id)">Удалить</button>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDoctors } from "../composables/useDoctors";

const { doctors, loading, editingId, form, canSubmit, refresh, submit, remove, startEdit, cancelEdit } =
  useDoctors();
</script>

<style scoped>
.crud-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(8, 105, 166, 0.12);
  box-shadow: 0 10px 26px rgba(8, 105, 166, 0.1);
}

.crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.crud-header h3 {
  margin: 0 0 4px;
}

.crud-header p {
  margin: 0;
  color: rgba(12, 28, 44, 0.6);
  font-size: 13px;
}

.crud-form {
  display: grid;
  gap: 12px;
  margin-bottom: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(12, 28, 44, 0.6);
}

input {
  border: 1px solid rgba(8, 105, 166, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.primary {
  background: #4fb68e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid rgba(8, 105, 166, 0.35);
  color: #0869a6;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
}

.danger {
  background: transparent;
  border: 1px solid rgba(225, 81, 81, 0.6);
  color: #e15151;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
}

.list {
  display: grid;
  gap: 10px;
}

.table {
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1.2fr auto;
  gap: 12px;
  align-items: center;
  background: rgba(8, 105, 166, 0.04);
  padding: 10px 12px;
  border-radius: 12px;
}

.row.header {
  background: transparent;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(12, 28, 44, 0.5);
}

.actions-col {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.hint {
  color: rgba(12, 28, 44, 0.6);
  font-size: 14px;
}

</style>
