import { afterEach, describe, expect, it, vi } from "vitest";
import type { Appointment, AppointmentInput } from "../api/appointments";
import type { Doctor } from "../api/doctors";
import type { Service } from "../api/services";
import { withSetup, type WithSetupResult } from "../test/utils/withSetup";
import { useRecentAppointments } from "./useRecentAppointments";

const doctorsFixture: Doctor[] = [
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

const servicesFixture: Service[] = [
  {
    id: 101,
    name: "Консультация",
    price: 2500,
    doctor_id: 1,
    created_at: "2026-03-20T10:00:00"
  },
  {
    id: 102,
    name: "Операция",
    price: 10000,
    doctor_id: 2,
    created_at: "2026-03-20T10:10:00"
  }
];

const appointmentsFixture: Appointment[] = [
  {
    id: 201,
    service_id: 101,
    total_price: 2500,
    description: "Контроль",
    date: "2026-03-22T11:20:00",
    created_at: "2026-03-20T12:00:00"
  },
  {
    id: 202,
    service_id: 102,
    total_price: 10000,
    description: "",
    date: "2026-03-22T13:05:00",
    created_at: "2026-03-20T12:10:00"
  }
];

function createDeps() {
  return {
    listAppointments: vi
      .fn<(limit?: number) => Promise<Appointment[]>>()
      .mockResolvedValue(appointmentsFixture),
    listServices: vi.fn<() => Promise<Service[]>>().mockResolvedValue(servicesFixture),
    listDoctors: vi.fn<() => Promise<Doctor[]>>().mockResolvedValue(doctorsFixture),
    updateAppointment: vi
      .fn<(id: number, input: AppointmentInput) => Promise<{ ok: true }>>()
      .mockResolvedValue({ ok: true }),
    deleteAppointment: vi.fn<(id: number) => Promise<{ ok: true }>>().mockResolvedValue({ ok: true }),
    pushToast: vi.fn<(message: string, type?: "error" | "info" | "success") => void>()
  };
}

const scopes: Array<WithSetupResult<unknown>> = [];

function mountComposable(options?: Parameters<typeof useRecentAppointments>[0]) {
  const scope = withSetup(() => useRecentAppointments(options));
  scopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

describe("Composable последних приёмов", () => {
  afterEach(async () => {
    vi.restoreAllMocks();

    while (scopes.length > 0) {
      await scopes.pop()?.cleanup();
    }
  });

  it("инициализирует данные с указанным лимитом", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false,
      limit: 5
    });

    await scope.result.init();

    expect(deps.listAppointments).toHaveBeenCalledWith(5);
    expect(scope.result.appointments.value).toEqual(appointmentsFixture);
    expect(scope.result.services.value).toEqual(servicesFixture);
    expect(scope.result.doctors.value).toEqual(doctorsFixture);
  });

  it("не делает скрытых запросов при autoLoad=false", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.flush();

    expect(deps.listAppointments).not.toHaveBeenCalled();
    expect(deps.listServices).not.toHaveBeenCalled();
    expect(deps.listDoctors).not.toHaveBeenCalled();
  });

  it("автоматически загружает данные при autoLoad=true", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: true
    });

    await scope.flush();

    expect(deps.listAppointments).toHaveBeenCalledWith(10);
    expect(deps.listServices).toHaveBeenCalledTimes(1);
    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(scope.result.appointments.value).toEqual(appointmentsFixture);
  });

  it("открывает редактирование и форматирует отображаемые подписи", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.openEdit(appointmentsFixture[0]);

    expect(scope.result.editOpen.value).toBe(true);
    expect(scope.result.editForm).toMatchObject({
      id: 201,
      service_id: 101,
      total_price: 2500,
      description: "Контроль"
    });
    expect(scope.result.editDate.value).toBe("2026-03-22");
    expect(scope.result.editTime.value).toBe("11:20");
    expect(scope.result.formatDateTime("2026-03-22T11:20:00")).toBe("2026-03-22 11:20");
    expect(scope.result.serviceLabel(101)).toBe("Консультация • Иванов Иван");
    expect(scope.result.serviceTitle(servicesFixture[1])).toBe("Операция — Петров Пётр");
  });

  it("openEdit корректно заполняет state даже при пустом описании", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.openEdit(appointmentsFixture[1]);

    expect(scope.result.editForm).toMatchObject({
      id: 202,
      service_id: 102,
      total_price: 10000,
      description: ""
    });
    expect(scope.result.editDate.value).toBe("2026-03-22");
    expect(scope.result.editTime.value).toBe("13:05");
    expect(scope.result.formatDateTime("")).toBe("—");
    expect(scope.result.serviceLabel(999)).toBe("—");
  });

  it("сохраняет редактирование, показывает toast и закрывает диалог", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.openEdit(appointmentsFixture[0]);
    scope.result.editTime.value = "12:10";

    await scope.result.saveEdit();

    expect(deps.updateAppointment).toHaveBeenCalledWith(201, {
      service_id: 101,
      total_price: 2500,
      description: "Контроль",
      date: "2026-03-22T12:10"
    });
    expect(deps.updateAppointment.mock.calls[0][1]).not.toHaveProperty("id");
    expect(deps.pushToast).toHaveBeenCalledWith("Приём обновлён", "success");
    expect(scope.result.editOpen.value).toBe(false);
    expect(deps.listAppointments).toHaveBeenCalledTimes(2);
  });

  it("не сохраняет пустое редактирование и удаляет приём отдельным методом", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.saveEdit();
    expect(deps.updateAppointment).not.toHaveBeenCalled();

    await scope.result.remove(201);

    expect(deps.deleteAppointment).toHaveBeenCalledWith(201);
    expect(deps.pushToast).toHaveBeenCalledWith("Приём удалён", "info");
    expect(deps.listAppointments).toHaveBeenCalledTimes(1);
  });

  it("после успешного удаления вызывает refresh", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    await scope.result.remove(201);

    expect(deps.listAppointments).toHaveBeenCalledTimes(2);
  });

  it("пробрасывает ошибку refresh и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("list failed");
    deps.listAppointments.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.refresh()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку update и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("update failed");
    deps.updateAppointment.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.openEdit(appointmentsFixture[0]);

    await expect(scope.result.saveEdit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку delete и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("delete failed");
    deps.deleteAppointment.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.remove(201)).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });
});
