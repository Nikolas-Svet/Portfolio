import type { Appointment, AppointmentInput } from "../../api/appointments";
import type { Service } from "../../api/services";
import {
  formatApiDateTime,
  normalizeDatePickerValue,
  splitApiDateTime,
  type DatePickerValue
} from "../shared/dateTimeService";

type TimeValue = string | Date | null | undefined;
const TIME_PART_RE = /(?:^|[T\s])(\d{2}):(\d{2})/;

function isValidTimeValue(value: TimeValue) {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const match = trimmed.match(TIME_PART_RE);
  if (!match) {
    return false;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

export type AppointmentFormState = Pick<
  AppointmentInput,
  "service_id" | "total_price" | "description"
>;

export type AppointmentEditFormState = AppointmentFormState & { id: number };

export type AppointmentEditState = {
  form: AppointmentEditFormState;
  date: string;
  time: string;
};

// Returns the initial state for appointment create/edit form fields.
export function createInitialAppointmentForm(): AppointmentFormState {
  return {
    service_id: 0,
    total_price: 0,
    description: ""
  };
}

// Returns a reset appointment form state merged with optional defaults.
export function resetAppointmentForm(
  defaults: Partial<AppointmentFormState> = {}
): AppointmentFormState {
  return {
    ...createInitialAppointmentForm(),
    ...defaults
  };
}

// Applies the selected service to appointment form state and respects auto-price mode.
export function applySelectedService(
  form: AppointmentFormState,
  service: Service,
  autoPrice: boolean
): AppointmentFormState {
  return {
    ...form,
    service_id: service.id,
    total_price: autoPrice ? service.price : form.total_price
  };
}

// Checks whether the appointment form is ready to be submitted.
export function isAppointmentSubmitReady(
  form: AppointmentFormState,
  date: DatePickerValue,
  time: TimeValue
) {
  return (
    form.service_id > 0 &&
    form.total_price >= 0 &&
    normalizeDatePickerValue(date).length > 0 &&
    isValidTimeValue(time)
  );
}

// Builds the API payload for appointment creation.
export function buildCreateAppointmentPayload(
  form: AppointmentFormState,
  date: DatePickerValue,
  time: TimeValue
): AppointmentInput {
  return {
    service_id: form.service_id,
    total_price: form.total_price,
    description: form.description,
    date: formatApiDateTime(date, time)
  };
}

// Builds the API payload for appointment updates.
export function buildUpdateAppointmentPayload(
  form: AppointmentFormState,
  date: DatePickerValue,
  time: TimeValue
): AppointmentInput {
  return buildCreateAppointmentPayload(form, date, time);
}

// Maps an appointment entity into edit dialog form state and picker values.
export function mapAppointmentToEditState(appointment: Appointment): AppointmentEditState {
  const { date, time } = splitApiDateTime(appointment.date);

  return {
    form: {
      id: appointment.id,
      ...resetAppointmentForm({
        service_id: appointment.service_id,
        total_price: appointment.total_price,
        description: appointment.description
      })
    },
    date,
    time
  };
}
