import { computed, onMounted, reactive, ref } from "vue";
import type { Doctor } from "../api/doctors";
import { listDoctors } from "../api/doctors";
import type { Service } from "../api/services";
import { listServices } from "../api/services";
import { createAppointment } from "../api/appointments";
import {
  applySelectedService,
  buildCreateAppointmentPayload,
  createInitialAppointmentForm,
  isAppointmentSubmitReady,
  resetAppointmentForm
} from "../services/appointments/appointmentService";
import {
  type DatePickerValue,
  formatApiDateTime,
  splitApiDateTime
} from "../services/shared/dateTimeService";
import { pushToast } from "../ui/toasts";

type AppointmentFormDeps = {
  listDoctors: typeof listDoctors;
  listServices: typeof listServices;
  createAppointment: typeof createAppointment;
  pushToast: typeof pushToast;
  now: () => Date;
};

export type UseAppointmentFormOptions = {
  autoLoad?: boolean;
  deps?: Partial<AppointmentFormDeps>;
};

const defaultDeps: AppointmentFormDeps = {
  listDoctors,
  listServices,
  createAppointment,
  pushToast,
  now: () => new Date()
};

export function useAppointmentForm(options: UseAppointmentFormOptions = {}) {
  const { autoLoad = true } = options;
  const deps: AppointmentFormDeps = { ...defaultDeps, ...options.deps };
  const doctors = ref<Doctor[]>([]);
  const servicesByDoctor = ref<Record<number, Service[]>>({});
  const loading = ref(false);
  const autoPrice = ref(true);
  const selectedDoctorId = ref(0);
  const hoverDoctorId = ref<number | null>(null);
  const dateValue = ref<DatePickerValue>("");
  const timeValue = ref<string | Date | null>("");
  const form = reactive(createInitialAppointmentForm());

  const canSubmit = computed(() =>
    isAppointmentSubmitReady(form, dateValue.value, timeValue.value)
  );

  const visibleDoctorId = computed(() => hoverDoctorId.value ?? selectedDoctorId.value);
  const visibleServices = computed(() => {
    const id = visibleDoctorId.value;
    if (!id) return [];
    return servicesByDoctor.value[id] ?? [];
  });

  function setCurrentDateTime() {
    const current = deps.now();
    const now = splitApiDateTime(formatApiDateTime(current, current));
    dateValue.value = now.date;
    timeValue.value = now.time;
  }

  function doctorTitle(doc: Doctor) {
    return `${doc.full_name} — ${doc.doctor_type}`;
  }

  async function loadServicesForDoctor(id: number) {
    if (servicesByDoctor.value[id]) return;

    const services = await deps.listServices(id);
    servicesByDoctor.value = { ...servicesByDoctor.value, [id]: services };
  }

  function syncPriceFromService() {
    if (!autoPrice.value) return;

    const service = visibleServices.value.find((item) => item.id === form.service_id);
    if (service) {
      Object.assign(form, applySelectedService(form, service, autoPrice.value));
    }
  }

  async function loadServices() {
    doctors.value = await deps.listDoctors();
    if (doctors.value.length > 0 && selectedDoctorId.value === 0) {
      selectedDoctorId.value = doctors.value[0].id;
    }
    if (selectedDoctorId.value) {
      await loadServicesForDoctor(selectedDoctorId.value);
    }
  }

  function clearHoveredDoctor() {
    hoverDoctorId.value = null;
  }

  async function previewDoctor(id: number) {
    hoverDoctorId.value = id;
    await loadServicesForDoctor(id);
  }

  async function selectDoctor(id: number | null) {
    if (!id) return;

    selectedDoctorId.value = id;
    await loadServicesForDoctor(id);
    if (form.service_id !== 0) {
      const current = servicesByDoctor.value[id]?.some((service) => service.id === form.service_id);
      if (!current) form.service_id = 0;
    }
  }

  function selectService(service: Service) {
    Object.assign(form, applySelectedService(form, service, autoPrice.value));
  }

  function disableAutoPrice() {
    autoPrice.value = false;
  }

  function onAutoPriceChange() {
    if (autoPrice.value) syncPriceFromService();
  }

  function resetForm() {
    Object.assign(form, resetAppointmentForm());
    setCurrentDateTime();
    autoPrice.value = true;
  }

  async function init() {
    setCurrentDateTime();
    await loadServices();
  }

  async function submit() {
    if (!canSubmit.value) return;

    loading.value = true;
    try {
      await deps.createAppointment(
        buildCreateAppointmentPayload(form, dateValue.value, timeValue.value)
      );
      deps.pushToast("Приём создан", "success");
      resetForm();
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
    servicesByDoctor,
    loading,
    autoPrice,
    selectedDoctorId,
    hoverDoctorId,
    form,
    dateValue,
    timeValue,
    canSubmit,
    visibleServices,
    init,
    doctorTitle,
    clearHoveredDoctor,
    previewDoctor,
    selectDoctor,
    selectService,
    disableAutoPrice,
    onAutoPriceChange,
    submit,
    resetForm
  };
}
