import { describe, expect, it } from "vitest";
import type { Appointment } from "../../api/appointments";
import type { Service } from "../../api/services";
import {
  applySelectedService,
  buildCreateAppointmentPayload,
  buildUpdateAppointmentPayload,
  createInitialAppointmentForm,
  isAppointmentSubmitReady,
  mapAppointmentToEditState,
  resetAppointmentForm
} from "./appointmentService";

const service: Service = {
  id: 15,
  name: "УЗИ",
  price: 3200,
  doctor_id: 3,
  created_at: "2026-03-20T10:00:00"
};

const appointment: Appointment = {
  id: 21,
  service_id: 15,
  total_price: 3200,
  description: "Контроль",
  date: "2026-03-21T14:35:00",
  created_at: "2026-03-20T11:00:00"
};

describe("Сервис приёмов", () => {
  it("создаёт начальное состояние формы приёма", () => {
    expect(createInitialAppointmentForm()).toEqual({
      service_id: 0,
      total_price: 0,
      description: ""
    });
  });

  it("сбрасывает форму и применяет переданные значения по умолчанию", () => {
    expect(
      resetAppointmentForm({
        service_id: 15,
        description: "Повторный визит"
      })
    ).toEqual({
      service_id: 15,
      total_price: 0,
      description: "Повторный визит"
    });
  });

  it("сбрасывает форму с частичными defaults без потери остальных полей", () => {
    expect(
      resetAppointmentForm({
        total_price: 4100
      })
    ).toEqual({
      service_id: 0,
      total_price: 4100,
      description: ""
    });
  });

  it("применяет выбранную услугу и автоподстановку цены", () => {
    expect(
      applySelectedService(
        {
          service_id: 0,
          total_price: 0,
          description: ""
        },
        service,
        true
      )
    ).toEqual({
      service_id: 15,
      total_price: 3200,
      description: ""
    });
  });

  it("сохраняет ручную цену, если автоподстановка отключена", () => {
    expect(
      applySelectedService(
        {
          service_id: 0,
          total_price: 4100,
          description: ""
        },
        service,
        false
      )
    ).toEqual({
      service_id: 15,
      total_price: 4100,
      description: ""
    });
  });

  it("проверяет готовность формы к отправке", () => {
    expect(
      isAppointmentSubmitReady(
        {
          service_id: 15,
          total_price: 3200,
          description: ""
        },
        "2026-03-21",
        "14:35"
      )
    ).toBe(true);
  });

  it("отклоняет отправку, если дата или время не заполнены", () => {
    expect(
      isAppointmentSubmitReady(
        {
          service_id: 15,
          total_price: 3200,
          description: ""
        },
        "",
        " "
      )
    ).toBe(false);
  });

  it("отклоняет отправку при невалидной дате или времени", () => {
    expect(
      isAppointmentSubmitReady(
        {
          service_id: 15,
          total_price: 3200,
          description: ""
        },
        "not-a-date",
        "14:35"
      )
    ).toBe(false);

    expect(
      isAppointmentSubmitReady(
        {
          service_id: 15,
          total_price: 3200,
          description: ""
        },
        "2026-03-21",
        "99:99"
      )
    ).toBe(false);
  });

  it("собирает payload для создания приёма", () => {
    expect(
      buildCreateAppointmentPayload(
        {
          service_id: 15,
          total_price: 3200,
          description: "Контроль"
        },
        "2026-03-21",
        "14:35"
      )
    ).toEqual({
      service_id: 15,
      total_price: 3200,
      description: "Контроль",
      date: "2026-03-21T14:35"
    });
  });

  it("разрешает пустое описание в payload приёма", () => {
    expect(
      buildCreateAppointmentPayload(
        {
          service_id: 15,
          total_price: 3200,
          description: ""
        },
        "2026-03-21",
        "14:35"
      )
    ).toEqual({
      service_id: 15,
      total_price: 3200,
      description: "",
      date: "2026-03-21T14:35"
    });
  });

  it("собирает payload для обновления приёма", () => {
    expect(
      buildUpdateAppointmentPayload(
        {
          service_id: 15,
          total_price: 3300,
          description: "Исправленная цена"
        },
        "2026-03-21",
        "15:05"
      )
    ).toEqual({
      service_id: 15,
      total_price: 3300,
      description: "Исправленная цена",
      date: "2026-03-21T15:05"
    });
  });

  it("не пропускает id в update payload и сохраняет ручную цену", () => {
    const payload = buildUpdateAppointmentPayload(
      {
        id: 21,
        service_id: 15,
        total_price: 4100,
        description: ""
      },
      "2026-03-21",
      "15:05"
    );

    expect(payload).toEqual({
      service_id: 15,
      total_price: 4100,
      description: "",
      date: "2026-03-21T15:05"
    });
    expect("id" in payload).toBe(false);
  });

  it("не пропускает id в payload обновления в regression-кейсе edit state", () => {
    const editState = mapAppointmentToEditState(appointment);
    const payload = buildUpdateAppointmentPayload(editState.form, editState.date, editState.time);

    expect(payload).toEqual({
      service_id: 15,
      total_price: 3200,
      description: "Контроль",
      date: "2026-03-21T14:35"
    });
    expect("id" in payload).toBe(false);
  });

  it("мапит приём в состояние редактирования", () => {
    expect(mapAppointmentToEditState(appointment)).toEqual({
      form: {
        id: 21,
        service_id: 15,
        total_price: 3200,
        description: "Контроль"
      },
      date: "2026-03-21",
      time: "14:35"
    });
  });
});
