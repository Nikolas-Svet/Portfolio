import { describe, expect, it } from "vitest";
import type { Doctor } from "../../api/doctors";
import type { Service } from "../../api/services";
import {
  buildDoctorDetailsLabel,
  buildDoctorLabel,
  buildServicePayload,
  createEmptyServiceForm,
  isServiceFormValid,
  mapServiceToForm,
  resolveDefaultDoctorId
} from "./serviceService";

const doctors: Doctor[] = [
  {
    id: 1,
    doctor_type: "Терапевт",
    full_name: "Иванов Иван",
    created_at: "2026-03-20T09:00:00"
  },
  {
    id: 2,
    doctor_type: "Хирург",
    full_name: "Петров Пётр",
    created_at: "2026-03-20T09:10:00"
  }
];

const service: Service = {
  id: 11,
  name: "Консультация",
  price: 2500,
  doctor_id: 2,
  created_at: "2026-03-20T10:00:00"
};

describe("Сервис услуг", () => {
  it("создаёт пустую форму услуги без doctor id по умолчанию", () => {
    expect(createEmptyServiceForm()).toEqual({
      name: "",
      price: 0,
      doctor_id: 0
    });
  });

  it("создаёт пустую форму услуги с doctor id по умолчанию", () => {
    expect(createEmptyServiceForm(2)).toEqual({
      name: "",
      price: 0,
      doctor_id: 2
    });
  });

  it("валидирует корректную форму услуги", () => {
    expect(
      isServiceFormValid({
        name: " Консультация ",
        price: 2500,
        doctor_id: 2
      })
    ).toBe(true);
  });

  it("отклоняет невалидную форму услуги", () => {
    expect(
      isServiceFormValid({
        name: " ",
        price: -1,
        doctor_id: 0
      })
    ).toBe(false);
  });

  it("отклоняет форму услуги с пустым именем, даже если doctor и price заполнены", () => {
    expect(
      isServiceFormValid({
        name: " ",
        price: 2500,
        doctor_id: 2
      })
    ).toBe(false);
  });

  it("отклоняет форму услуги без выбранного врача", () => {
    expect(
      isServiceFormValid({
        name: "Консультация",
        price: 2500,
        doctor_id: 0
      })
    ).toBe(false);
  });

  it("считает нулевую цену допустимой по текущему правилу валидации", () => {
    expect(
      isServiceFormValid({
        name: "Бесплатная консультация",
        price: 0,
        doctor_id: 1
      })
    ).toBe(true);
  });

  it("мапит API-сущность услуги в форму", () => {
    expect(mapServiceToForm(service)).toEqual({
      name: "Консультация",
      price: 2500,
      doctor_id: 2
    });
  });

  it("собирает payload услуги и обрезает пробелы", () => {
    expect(
      buildServicePayload({
        name: " Консультация ",
        price: 2500,
        doctor_id: 2
      })
    ).toEqual({
      name: "Консультация",
      price: 2500,
      doctor_id: 2
    });
  });

  it("форматирует подписи врача для списка и деталей", () => {
    expect(buildDoctorLabel(doctors[0])).toBe("Иванов Иван — Терапевт");
    expect(buildDoctorDetailsLabel(doctors[1])).toBe("Петров Пётр (Хирург)");
  });

  it("сохраняет текущего врача, если он ещё есть в списке", () => {
    expect(resolveDefaultDoctorId(doctors, 2)).toBe(2);
  });

  it("выбирает первого врача, если текущий doctor id недоступен", () => {
    expect(resolveDefaultDoctorId(doctors, 99)).toBe(1);
  });

  it("возвращает 0, если врачей нет", () => {
    expect(resolveDefaultDoctorId([])).toBe(0);
  });
});
