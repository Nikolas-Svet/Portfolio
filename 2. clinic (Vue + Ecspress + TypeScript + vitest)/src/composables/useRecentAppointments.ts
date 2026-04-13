import { onMounted, reactive, ref } from "vue";
import type { Appointment } from "../api/appointments";
import { deleteAppointment, listAppointments, updateAppointment } from "../api/appointments";
import type { Doctor } from "../api/doctors";
import { listDoctors } from "../api/doctors";
import type { Service } from "../api/services";
import { listServices } from "../api/services";
import {
  buildUpdateAppointmentPayload,
  createInitialAppointmentForm,
  mapAppointmentToEditState
} from "../services/appointments/appointmentService";
import { splitApiDateTime } from "../services/shared/dateTimeService";
import { pushToast } from "../ui/toasts";

type RecentAppointmentsDeps = {
  listAppointments: typeof listAppointments;
  listServices: typeof listServices;
  listDoctors: typeof listDoctors;
  updateAppointment: typeof updateAppointment;
  deleteAppointment: typeof deleteAppointment;
  pushToast: typeof pushToast;
};

export type UseRecentAppointmentsOptions = {
  autoLoad?: boolean;
  limit?: number;
  deps?: Partial<RecentAppointmentsDeps>;
};

const defaultDeps: RecentAppointmentsDeps = {
  listAppointments,
  listServices,
  listDoctors,
  updateAppointment,
  deleteAppointment,
  pushToast
};

export function useRecentAppointments(options: UseRecentAppointmentsOptions = {}) {
  const { autoLoad = true, limit = 10 } = options;
  const deps: RecentAppointmentsDeps = { ...defaultDeps, ...options.deps };
  const appointments = ref<Appointment[]>([]);
  const services = ref<Service[]>([]);
  const doctors = ref<Doctor[]>([]);
  const loading = ref(false);
  const editOpen = ref(false);
  const editForm = reactive({
    id: 0,
    ...createInitialAppointmentForm()
  });
  const editDate = ref("");
  const editTime = ref("");

  function formatDateTime(value: string) {
    if (!value) return "—";

    const { date, time } = splitApiDateTime(value);
    return `${date} ${time}`;
  }

  function serviceLabel(serviceId: number) {
    const service = services.value.find((item) => item.id === serviceId);
    if (!service) return "—";

    const doctor = doctors.value.find((item) => item.id === service.doctor_id);
    const doctorPart = doctor ? ` • ${doctor.full_name}` : "";
    return `${service.name}${doctorPart}`;
  }

  function serviceTitle(service: Service) {
    const doctor = doctors.value.find((item) => item.id === service.doctor_id);
    const doctorPart = doctor ? ` — ${doctor.full_name}` : "";
    return `${service.name}${doctorPart}`;
  }

  async function refresh() {
    loading.value = true;
    try {
      const [loadedAppointments, loadedServices, loadedDoctors] = await Promise.all([
        deps.listAppointments(limit),
        deps.listServices(),
        deps.listDoctors()
      ]);
      appointments.value = loadedAppointments;
      services.value = loadedServices;
      doctors.value = loadedDoctors;
    } finally {
      loading.value = false;
    }
  }

  async function init() {
    await refresh();
  }

  function openEdit(appointment: Appointment) {
    const editState = mapAppointmentToEditState(appointment);
    Object.assign(editForm, editState.form);
    editDate.value = editState.date;
    editTime.value = editState.time;
    editOpen.value = true;
  }

  async function saveEdit() {
    if (!editForm.id) return;

    loading.value = true;
    try {
      await deps.updateAppointment(
        editForm.id,
        buildUpdateAppointmentPayload(editForm, editDate.value, editTime.value)
      );
      deps.pushToast("Приём обновлён", "success");
      editOpen.value = false;
      await refresh();
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: number) {
    loading.value = true;
    try {
      await deps.deleteAppointment(id);
      deps.pushToast("Приём удалён", "info");
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
    appointments,
    services,
    doctors,
    loading,
    editOpen,
    editForm,
    editDate,
    editTime,
    init,
    refresh,
    openEdit,
    saveEdit,
    remove,
    formatDateTime,
    serviceLabel,
    serviceTitle
  };
}
