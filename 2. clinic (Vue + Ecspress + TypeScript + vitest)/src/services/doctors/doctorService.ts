import type { Doctor, DoctorInput } from "../../api/doctors";

export type DoctorForm = DoctorInput;

// Returns an empty doctor form state for create/reset flows.
export function createEmptyDoctorForm(): DoctorForm {
  return {
    doctor_type: "",
    full_name: ""
  };
}

// Checks whether a doctor form satisfies the UI validation rules.
export function isDoctorFormValid(form: DoctorForm) {
  return form.doctor_type.trim().length > 0 && form.full_name.trim().length > 0;
}

// Maps an API doctor entity into editable doctor form state.
export function mapDoctorToForm(doctor: Doctor): DoctorForm {
  return {
    doctor_type: doctor.doctor_type,
    full_name: doctor.full_name
  };
}

// Builds the doctor payload expected by the API from form state.
export function buildDoctorPayload(form: DoctorForm): DoctorInput {
  return {
    doctor_type: form.doctor_type.trim(),
    full_name: form.full_name.trim()
  };
}
