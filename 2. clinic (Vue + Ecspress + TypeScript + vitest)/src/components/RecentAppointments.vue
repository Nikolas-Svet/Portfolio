<template>
  <v-card class="crud-card" elevation="0">
    <div class="crud-header">
      <div>
        <h3>Последние приёмы</h3>
        <p>Последние 10 созданных приёмов с быстрым редактированием.</p>
      </div>
      <v-btn variant="outlined" @click="refresh" :loading="loading">Обновить</v-btn>
    </div>

    <div v-if="appointments.length === 0" class="hint">Приёмов пока нет.</div>

    <v-table v-else density="compact">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Услуга</th>
          <th>Итог</th>
          <th>Описание</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in appointments" :key="item.id">
          <td>{{ formatDateTime(item.date) }}</td>
          <td>{{ serviceLabel(item.service_id) }}</td>
          <td>{{ formatPrice(item.total_price) }}</td>
          <td class="truncate">{{ item.description }}</td>
          <td class="actions">
            <v-btn size="small" variant="text" @click="openEdit(item)">Редактировать</v-btn>
            <v-btn size="small" variant="text" color="error" @click="remove(item.id)">
              Удалить
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="editOpen" max-width="520">
      <v-card>
        <v-card-title>Редактировать приём</v-card-title>
        <v-card-text>
          <v-select
            label="Услуга"
            :items="services"
            :item-title="serviceTitle"
            item-value="id"
            v-model="editForm.service_id"
          />

          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field label="Дата" v-model="editDate" readonly v-bind="props" />
            </template>
            <v-date-picker v-model="editDate" />
          </v-menu>

          <v-menu v-model="timeMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field label="Время" v-model="editTime" readonly v-bind="props" />
            </template>
            <v-time-picker v-model="editTime" format="24hr" />
          </v-menu>

          <v-text-field
            label="Итоговая цена"
            type="number"
            v-model.number="editForm.total_price"
          />
          <v-textarea label="Описание" v-model="editForm.description" rows="3" auto-grow />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editOpen = false">Отмена</v-btn>
          <v-btn color="primary" @click="saveEdit" :loading="loading">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRecentAppointments } from "../composables/useRecentAppointments";
import { formatPrice } from "../services/shared/priceService";
const dateMenu = ref(false);
const timeMenu = ref(false);

const {
  appointments,
  services,
  loading,
  editOpen,
  editForm,
  editDate,
  editTime,
  refresh,
  openEdit,
  saveEdit,
  remove,
  formatDateTime,
  serviceLabel,
  serviceTitle
} = useRecentAppointments();
</script>

<style scoped>
.crud-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(8, 105, 166, 0.12);
}

.crud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.crud-header h3 {
  margin: 0 0 4px;
}

.crud-header p {
  margin: 0;
  color: rgba(12, 28, 44, 0.6);
  font-size: 13px;
}

.hint {
  color: rgba(12, 28, 44, 0.6);
}

.truncate {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
</style>
