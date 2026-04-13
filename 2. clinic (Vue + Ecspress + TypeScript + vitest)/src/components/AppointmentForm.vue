<template>
  <v-card class="crud-card" elevation="0">
    <div class="crud-header">
      <div>
        <h3>Оформление приёма</h3>
        <p>Сначала выберите врача, затем услугу и время.</p>
      </div>
    </div>

    <v-form @submit.prevent="submit">
      <div class="grid">
        <div class="picker">
          <div class="picker-title">Врач и услуга</div>
          <div class="tree">
            <div class="tree-left" @mouseleave="clearHoveredDoctor">
              <div class="tree-label">Врачи</div>
              <v-list density="compact">
                <v-list-item
                  v-for="doc in doctors"
                  :key="doc.id"
                  :class="{ active: doc.id === selectedDoctorId }"
                  @mouseenter="previewDoctor(doc.id)"
                  @click="selectDoctor(doc.id)"
                >
                  <v-list-item-title>{{ doc.full_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ doc.doctor_type }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <div class="tree-right">
              <div class="tree-label">Услуги</div>
              <v-list density="compact">
                <v-list-item
                  v-for="srv in visibleServices"
                  :key="srv.id"
                  :class="{ active: srv.id === form.service_id }"
                  @click="selectService(srv)"
                >
                  <v-list-item-title>{{ srv.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatPrice(srv.price) }}</v-list-item-subtitle>
                </v-list-item>
                <div v-if="visibleServices.length === 0" class="hint">
                  Нет услуг для выбранного врача
                </div>
              </v-list>
            </div>
          </div>
        </div>

        <div class="form">
          <v-select
            label="Врач (выбран)"
            :items="doctors"
            :item-title="doctorTitle"
            item-value="id"
            v-model="selectedDoctorId"
            @update:model-value="selectDoctor"
          />

          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field label="Дата" v-model="dateValue" readonly v-bind="props" />
            </template>
            <v-date-picker v-model="dateValue" />
          </v-menu>

          <v-menu v-model="timeMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field label="Время" v-model="timeValue" readonly v-bind="props" />
            </template>
            <v-time-picker v-model="timeValue" format="24hr" />
          </v-menu>

          <v-text-field
            label="Итоговая цена"
            type="number"
            v-model.number="form.total_price"
            @update:model-value="disableAutoPrice"
          />

          <v-switch
            v-model="autoPrice"
            color="success"
            label="Подставлять цену услуги автоматически"
            @update:model-value="onAutoPriceChange"
          />

          <v-textarea
            label="Описание"
            v-model="form.description"
            rows="3"
            auto-grow
          />

          <div class="actions">
            <v-btn color="primary" type="submit" :loading="loading" :disabled="!canSubmit">
              Создать приём
            </v-btn>
            <v-btn variant="outlined" @click="resetForm">Сброс</v-btn>
          </div>
        </div>
      </div>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppointmentForm } from "../composables/useAppointmentForm";
import { formatPrice } from "../services/shared/priceService";
const dateMenu = ref(false);
const timeMenu = ref(false);

const {
  doctors,
  loading,
  autoPrice,
  selectedDoctorId,
  form,
  dateValue,
  timeValue,
  canSubmit,
  visibleServices,
  doctorTitle,
  clearHoveredDoctor,
  previewDoctor,
  selectDoctor,
  selectService,
  disableAutoPrice,
  onAutoPriceChange,
  submit,
  resetForm
} = useAppointmentForm();
</script>

<style>
.v-time-picker .v-picker__body {
  display: none !important;
}
</style>
<style scoped>
.crud-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(8, 105, 166, 0.12);
}

.crud-header h3 {
  margin: 0 0 4px;
}

.crud-header p {
  margin: 0;
  color: rgba(12, 28, 44, 0.6);
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-top: 16px;
}

.picker {
  border: 1px solid rgba(8, 105, 166, 0.12);
  border-radius: 16px;
  padding: 16px;
  background: rgba(8, 105, 166, 0.03);
}

.picker-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.tree {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tree-left,
.tree-right {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(8, 105, 166, 0.12);
  padding: 8px;
}

:deep(.v-list-item.active) {
  background: rgba(79, 182, 142, 0.14);
  border-radius: 12px;
}

.tree-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(12, 28, 44, 0.5);
  margin: 6px 6px 8px;
}

.hint {
  padding: 8px 12px;
  color: rgba(12, 28, 44, 0.6);
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
