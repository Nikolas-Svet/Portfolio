import type { Doctor } from "../../api/doctors";
import type { Service, ServiceInput } from "../../api/services";

export type ServiceForm = ServiceInput;

// Returns an empty service form state with an optional default doctor id.
export function createEmptyServiceForm(defaultDoctorId = 0): ServiceForm {
  return {
    name: "",
    price: 0,
    doctor_id: defaultDoctorId
  };
}

// Checks whether a service form satisfies the UI validation rules.
export function isServiceFormValid(form: ServiceForm) {
  return form.name.trim().length > 0 && form.price >= 0 && form.doctor_id > 0;
}

// Maps an API service entity into editable service form state.
export function mapServiceToForm(service: Service): ServiceForm {
  return {
    name: service.name,
    price: service.price,
    doctor_id: service.doctor_id
  };
}

// Builds the service payload expected by the API from form state.
export function buildServicePayload(form: ServiceForm): ServiceInput {
  return {
    name: form.name.trim(),
    price: form.price,
    doctor_id: form.doctor_id
  };
}

// Formats a doctor label for select inputs and filters in service screens.
export function buildDoctorLabel(doctor: Doctor) {
  return `${doctor.full_name} — ${doctor.doctor_type}`;
}

// Formats a doctor label for compact table display in service lists.
export function buildDoctorDetailsLabel(doctor: Doctor) {
  return `${doctor.full_name} (${doctor.doctor_type})`;
}

// Resolves which doctor id should be preselected in a service form.
export function resolveDefaultDoctorId(doctors: Doctor[], currentDoctorId = 0) {
  if (currentDoctorId > 0 && doctors.some((doctor) => doctor.id === currentDoctorId)) {
    return currentDoctorId;
  }

  return doctors[0]?.id ?? 0;
}
