<template>
  <section class="crud-card">
    <header class="crud-header">
      <div>
        <h3>Услуги</h3>
        <p>Название, цена и привязка к врачу.</p>
      </div>
      <button class="primary" @click="refresh" :disabled="loading">Обновить</button>
    </header>

    <form class="crud-form" @submit.prevent="submit">
      <div class="field">
        <label>Название услуги</label>
        <input v-model.trim="form.name" placeholder="Консультация" />
      </div>
      <div class="field">
        <label>Цена</label>
        <input v-model.number="form.price" type="number" min="0" step="1" />
      </div>
      <div class="field">
        <label>Доктор</label>
        <select v-model.number="form.doctor_id">
          <option disabled value="0">Выберите врача</option>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            {{ buildDoctorLabel(doc) }}
          </option>
        </select>
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
      <div class="filter">
        <label>Фильтр по врачу</label>
        <select v-model.number="filterDoctorId" @change="applyFilter">
          <option :value="0">Все врачи</option>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            {{ buildDoctorLabel(doc) }}
          </option>
        </select>
      </div>
      <div v-if="loading" class="hint">Загрузка...</div>
      <div v-else-if="services.length === 0" class="hint">Пока нет услуг.</div>
      <div v-else class="table">
        <div class="row header">
          <span>Услуга</span>
          <span>Цена</span>
          <span>Доктор</span>
          <span class="actions-col">Действия</span>
        </div>
        <div v-for="srv in services" :key="srv.id" class="row">
          <span>{{ srv.name }}</span>
          <span>{{ formatPrice(srv.price) }}</span>
          <span>{{ doctorName(srv.doctor_id) }}</span>
          <span class="actions-col">
            <button class="ghost" @click="startEdit(srv)">Изменить</button>
            <button class="danger" @click="remove(srv.id)">Удалить</button>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useServices } from "../composables/useServices";
import { formatPrice } from "../services/shared/priceService";

const {
  services,
  doctors,
  loading,
  editingId,
  filterDoctorId,
  form,
  canSubmit,
  refresh,
  submit,
  remove,
  startEdit,
  cancelEdit,
  applyFilter,
  buildDoctorLabel,
  doctorName
} = useServices();
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

input,
select {
  border: 1px solid rgba(8, 105, 166, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
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

.filter {
  display: grid;
  gap: 6px;
}

.table {
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 0.6fr 1.4fr auto;
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
