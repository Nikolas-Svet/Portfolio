import { afterEach, describe, expect, it, vi } from "vitest";
import type { AppointmentInput } from "../api/appointments";
import type { Doctor } from "../api/doctors";
import type { Service } from "../api/services";
import { withSetup, type WithSetupResult } from "../test/utils/withSetup";
import { useAppointmentForm } from "./useAppointmentForm";

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

const servicesByDoctorFixture: Record<number, Service[]> = {
  1: [
    {
      id: 101,
      name: "Консультация",
      price: 2500,
      doctor_id: 1,
      created_at: "2026-03-20T10:00:00"
    },
    {
      id: 102,
      name: "Повторный приём",
      price: 1800,
      doctor_id: 1,
      created_at: "2026-03-20T10:10:00"
    }
  ],
  2: [
    {
      id: 201,
      name: "Операция",
      price: 10000,
      doctor_id: 2,
      created_at: "2026-03-20T10:20:00"
    }
  ]
};

const fixedNow = new Date(2026, 2, 22, 14, 45);

function createDeps() {
  return {
    listDoctors: vi.fn<() => Promise<Doctor[]>>().mockResolvedValue(doctorsFixture),
    listServices: vi
      .fn<(doctorId?: number) => Promise<Service[]>>()
      .mockImplementation(async (doctorId?: number) => {
        if (!doctorId) return [];
        return servicesByDoctorFixture[doctorId] ?? [];
      }),
    createAppointment: vi
      .fn<(input: AppointmentInput) => Promise<{ id: number }>>()
      .mockResolvedValue({ id: 33 }),
    pushToast: vi.fn<(message: string, type?: "error" | "info" | "success") => void>(),
    now: vi.fn<() => Date>().mockReturnValue(fixedNow)
  };
}

const scopes: Array<WithSetupResult<unknown>> = [];

function mountComposable(options?: Parameters<typeof useAppointmentForm>[0]) {
  const scope = withSetup(() => useAppointmentForm(options));
  scopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

describe("Composable формы приёма", () => {
  afterEach(async () => {
    vi.restoreAllMocks();

    while (scopes.length > 0) {
      await scopes.pop()?.cleanup();
    }
  });

  it("инициализирует текущие дату и время и загружает услуги первого врача", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();

    expect(scope.result.dateValue.value).toBe("2026-03-22");
    expect(scope.result.timeValue.value).toBe("14:45");
    expect(scope.result.selectedDoctorId.value).toBe(1);
    expect(scope.result.visibleServices.value).toEqual(servicesByDoctorFixture[1]);
    expect(deps.listServices).toHaveBeenCalledWith(1);
  });

  it("не делает скрытых запросов при autoLoad=false", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.flush();

    expect(deps.listDoctors).not.toHaveBeenCalled();
    expect(deps.listServices).not.toHaveBeenCalled();
  });

  it("автоматически инициализирует форму и загружает первого врача при autoLoad=true", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: true
    });

    await scope.flush();

    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(deps.listServices).toHaveBeenCalledWith(1);
    expect(scope.result.selectedDoctorId.value).toBe(1);
    expect(scope.result.dateValue.value).toBe("2026-03-22");
    expect(scope.result.timeValue.value).toBe("14:45");
  });

  it("корректно инициализируется в сценарии без врачей", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValueOnce([]);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();

    expect(scope.result.doctors.value).toEqual([]);
    expect(scope.result.selectedDoctorId.value).toBe(0);
    expect(scope.result.visibleServices.value).toEqual([]);
    expect(deps.listServices).not.toHaveBeenCalled();
  });

  it("форматирует подпись врача через doctorTitle()", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    expect(scope.result.doctorTitle(doctorsFixture[1])).toBe("Петров Пётр — Хирург");
  });

  it("показывает услуги выбранного врача, умеет preview и сбрасывает невалидную услугу", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.selectService(servicesByDoctorFixture[1][0]);

    await scope.result.previewDoctor(2);
    expect(scope.result.hoverDoctorId.value).toBe(2);
    expect(scope.result.visibleServices.value).toEqual(servicesByDoctorFixture[2]);

    await scope.result.selectDoctor(2);
    expect(scope.result.selectedDoctorId.value).toBe(2);
    expect(scope.result.form.service_id).toBe(0);

    scope.result.clearHoveredDoctor();
    expect(scope.result.hoverDoctorId.value).toBeNull();
  });

  it("синхронизирует цену услуги в режимах autoPrice on/off", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.selectService(servicesByDoctorFixture[1][0]);
    expect(scope.result.form.total_price).toBe(2500);

    scope.result.disableAutoPrice();
    scope.result.form.total_price = 3900;
    scope.result.selectService(servicesByDoctorFixture[1][1]);
    expect(scope.result.form.total_price).toBe(3900);

    scope.result.autoPrice.value = true;
    scope.result.onAutoPriceChange();
    expect(scope.result.form.total_price).toBe(1800);
  });

  it("не отправляет невалидную форму", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.submit();

    expect(deps.createAppointment).not.toHaveBeenCalled();
  });

  it("создаёт приём, показывает toast и сбрасывает форму", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.selectService(servicesByDoctorFixture[1][0]);
    scope.result.form.description = "Первичный визит";

    await scope.result.submit();

    expect(deps.createAppointment).toHaveBeenCalledWith({
      service_id: 101,
      total_price: 2500,
      description: "Первичный визит",
      date: "2026-03-22T14:45"
    });
    expect(deps.pushToast).toHaveBeenCalledWith("Приём создан", "success");
    expect(scope.result.form).toEqual({
      service_id: 0,
      total_price: 0,
      description: ""
    });
    expect(scope.result.autoPrice.value).toBe(true);
    expect(scope.result.dateValue.value).toBe("2026-03-22");
    expect(scope.result.timeValue.value).toBe("14:45");
  });

  it("создаёт приём с пустым описанием", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.selectService(servicesByDoctorFixture[1][0]);

    await scope.result.submit();

    expect(deps.createAppointment).toHaveBeenCalledWith({
      service_id: 101,
      total_price: 2500,
      description: "",
      date: "2026-03-22T14:45"
    });
  });

  it("пробрасывает ошибку listDoctors и не оставляет loading во включённом состоянии", async () => {
    const deps = createDeps();
    const error = new Error("doctors failed");
    deps.listDoctors.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.init()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку listServices и не оставляет loading во включённом состоянии", async () => {
    const deps = createDeps();
    const error = new Error("services failed");
    deps.listServices.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.init()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку createAppointment и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("create failed");
    deps.createAppointment.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.selectService(servicesByDoctorFixture[1][0]);

    await expect(scope.result.submit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });
});
