import { describe, expect, it } from "vitest";
import type { Doctor } from "../../api/doctors";
import {
  buildDoctorPayload,
  createEmptyDoctorForm,
  isDoctorFormValid,
  mapDoctorToForm
} from "./doctorService";

const doctor: Doctor = {
  id: 7,
  doctor_type: "Терапевт",
  full_name: "Иванов Иван",
  created_at: "2026-03-20T09:00:00"
};

describe("Сервис врачей", () => {
  it("создаёт пустую форму врача", () => {
    expect(createEmptyDoctorForm()).toEqual({
      doctor_type: "",
      full_name: ""
    });
  });

  it("валидирует заполненную форму врача", () => {
    expect(
      isDoctorFormValid({
        doctor_type: " Терапевт ",
        full_name: " Иванов Иван "
      })
    ).toBe(true);
  });

  it("отклоняет невалидную форму врача", () => {
    expect(
      isDoctorFormValid({
        doctor_type: " ",
        full_name: "Иванов Иван"
      })
    ).toBe(false);
  });

  it("отклоняет форму врача, если оба поля пустые или состоят из пробелов", () => {
    expect(
      isDoctorFormValid({
        doctor_type: "   ",
        full_name: " "
      })
    ).toBe(false);
  });

  it("мапит API-сущность врача в состояние формы", () => {
    expect(mapDoctorToForm(doctor)).toEqual({
      doctor_type: "Терапевт",
      full_name: "Иванов Иван"
    });
  });

  it("собирает payload врача и обрезает пробелы", () => {
    expect(
      buildDoctorPayload({
        doctor_type: " Терапевт ",
        full_name: " Иванов Иван "
      })
    ).toEqual({
      doctor_type: "Терапевт",
      full_name: "Иванов Иван"
    });
  });

  it("собирает невалидный payload в пустые строки после trim", () => {
    expect(
      buildDoctorPayload({
        doctor_type: "   ",
        full_name: " "
      })
    ).toEqual({
      doctor_type: "",
      full_name: ""
    });
  });
});
