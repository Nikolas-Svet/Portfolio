import { computed, onMounted, reactive, ref } from "vue";
import type { Doctor } from "../api/doctors";
import { createDoctor, deleteDoctor, listDoctors, updateDoctor } from "../api/doctors";
import {
  buildDoctorPayload,
  createEmptyDoctorForm,
  isDoctorFormValid,
  mapDoctorToForm
} from "../services/doctors/doctorService";

type DoctorsDeps = {
  listDoctors: typeof listDoctors;
  createDoctor: typeof createDoctor;
  updateDoctor: typeof updateDoctor;
  deleteDoctor: typeof deleteDoctor;
};

export type UseDoctorsOptions = {
  autoLoad?: boolean;
  deps?: Partial<DoctorsDeps>;
};

const defaultDeps: DoctorsDeps = {
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor
};

export function useDoctors(options: UseDoctorsOptions = {}) {
  const { autoLoad = true } = options;
  const deps: DoctorsDeps = { ...defaultDeps, ...options.deps };
  const doctors = ref<Doctor[]>([]);
  const loading = ref(false);
  const editingId = ref<number | null>(null);
  const form = reactive(createEmptyDoctorForm());

  const canSubmit = computed(() => isDoctorFormValid(form));

  async function refresh() {
    loading.value = true;
    try {
      doctors.value = await deps.listDoctors();
    } finally {
      loading.value = false;
    }
  }

  async function init() {
    await refresh();
  }

  function resetForm() {
    Object.assign(form, createEmptyDoctorForm());
    editingId.value = null;
  }

  function startEdit(doc: Doctor) {
    editingId.value = doc.id;
    Object.assign(form, mapDoctorToForm(doc));
  }

  function cancelEdit() {
    resetForm();
  }

  async function submit() {
    if (!canSubmit.value) return;

    loading.value = true;
    try {
      const payload = buildDoctorPayload(form);
      if (editingId.value) {
        await deps.updateDoctor(editingId.value, payload);
      } else {
        await deps.createDoctor(payload);
      }
      await refresh();
      resetForm();
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    loading.value = true;
    try {
      await deps.deleteDoctor(id);
      await refresh();
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    if (autoLoad) {
      void init();
    }
  });

  return {
    doctors,
    loading,
    editingId,
    form,
    canSubmit,
    init,
    refresh,
    submit,
    remove,
    startEdit,
    cancelEdit
  };
}
