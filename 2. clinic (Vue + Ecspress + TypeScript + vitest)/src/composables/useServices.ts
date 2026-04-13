import { computed, onMounted, reactive, ref } from "vue";
import type { Doctor } from "../api/doctors";
import { listDoctors } from "../api/doctors";
import type { Service } from "../api/services";
import { createService, deleteService, listServices, updateService } from "../api/services";
import {
  buildDoctorDetailsLabel,
  buildDoctorLabel,
  buildServicePayload,
  createEmptyServiceForm,
  isServiceFormValid,
  mapServiceToForm,
  resolveDefaultDoctorId
} from "../services/services/serviceService";

type ServicesDeps = {
  listDoctors: typeof listDoctors;
  listServices: typeof listServices;
  createService: typeof createService;
  updateService: typeof updateService;
  deleteService: typeof deleteService;
};

export type UseServicesOptions = {
  autoLoad?: boolean;
  initialFilterDoctorId?: number;
  deps?: Partial<ServicesDeps>;
};

const defaultDeps: ServicesDeps = {
  listDoctors,
  listServices,
  createService,
  updateService,
  deleteService
};

export function useServices(options: UseServicesOptions = {}) {
  const { autoLoad = true, initialFilterDoctorId = 0 } = options;
  const deps: ServicesDeps = { ...defaultDeps, ...options.deps };
  const services = ref<Service[]>([]);
  const doctors = ref<Doctor[]>([]);
  const loading = ref(false);
  const editingId = ref<number | null>(null);
  const filterDoctorId = ref(initialFilterDoctorId);
  const form = reactive(createEmptyServiceForm());

  const canSubmit = computed(() => isServiceFormValid(form));

  async function refresh() {
    loading.value = true;
    try {
      const [loadedDoctors, loadedServices] = await Promise.all([
        deps.listDoctors(),
        deps.listServices(filterDoctorId.value || undefined)
      ]);
      doctors.value = loadedDoctors;
      services.value = loadedServices;
      form.doctor_id = resolveDefaultDoctorId(doctors.value, form.doctor_id);
    } finally {
      loading.value = false;
    }
  }

  async function init() {
    await refresh();
  }

  function resetForm() {
    Object.assign(form, createEmptyServiceForm(resolveDefaultDoctorId(doctors.value)));
    editingId.value = null;
  }

  function startEdit(service: Service) {
    editingId.value = service.id;
    Object.assign(form, mapServiceToForm(service));
  }

  function cancelEdit() {
    resetForm();
  }

  function doctorName(doctorId: number) {
    const doctor = doctors.value.find((item) => item.id === doctorId);
    return doctor ? buildDoctorDetailsLabel(doctor) : "—";
  }

  async function submit() {
    if (!canSubmit.value) return;

    loading.value = true;
    try {
      const payload = buildServicePayload(form);
      if (editingId.value) {
        await deps.updateService(editingId.value, payload);
      } else {
        await deps.createService(payload);
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
      await deps.deleteService(id);
      await refresh();
    } finally {
      loading.value = false;
    }
  }

  async function applyFilter() {
    await refresh();
  }

  onMounted(() => {
    if (autoLoad) {
      void init();
    }
  });

  return {
    services,
    doctors,
    loading,
    editingId,
    filterDoctorId,
    form,
    canSubmit,
    init,
    refresh,
    submit,
    remove,
    startEdit,
    cancelEdit,
    applyFilter,
    buildDoctorLabel,
    doctorName
  };
}
