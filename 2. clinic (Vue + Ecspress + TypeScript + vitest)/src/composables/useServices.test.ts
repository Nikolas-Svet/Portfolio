import { afterEach, describe, expect, it, vi } from "vitest";
import type { Doctor } from "../api/doctors";
import type { Service, ServiceInput } from "../api/services";
import { withSetup, type WithSetupResult } from "../test/utils/withSetup";
import { useServices } from "./useServices";

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
    id: 11,
    name: "Консультация",
    price: 2500,
    doctor_id: 1,
    created_at: "2026-03-20T10:00:00"
  },
  {
    id: 12,
    name: "Операция",
    price: 10000,
    doctor_id: 2,
    created_at: "2026-03-20T10:10:00"
  }
];

function createDeps() {
  return {
    listDoctors: vi.fn<() => Promise<Doctor[]>>().mockResolvedValue(doctorsFixture),
    listServices: vi.fn<(doctorId?: number) => Promise<Service[]>>().mockResolvedValue(servicesFixture),
    createService: vi.fn<(input: ServiceInput) => Promise<{ id: number }>>().mockResolvedValue({ id: 1 }),
    updateService: vi
      .fn<(id: number, input: ServiceInput) => Promise<{ ok: true }>>()
      .mockResolvedValue({ ok: true }),
    deleteService: vi.fn<(id: number) => Promise<{ ok: true }>>().mockResolvedValue({ ok: true })
  };
}

const scopes: Array<WithSetupResult<unknown>> = [];

function mountComposable(options?: Parameters<typeof useServices>[0]) {
  const scope = withSetup(() => useServices(options));
  scopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

describe("Composable услуг", () => {
  afterEach(async () => {
    vi.restoreAllMocks();

    while (scopes.length > 0) {
      await scopes.pop()?.cleanup();
    }
  });

  it("инициализирует список врачей, услуг и doctor id по умолчанию", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();

    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(deps.listServices).toHaveBeenCalledWith(undefined);
    expect(scope.result.doctors.value).toEqual(doctorsFixture);
    expect(scope.result.services.value).toEqual(servicesFixture);
    expect(scope.result.form.doctor_id).toBe(1);
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

  it("автоматически загружает врачей и услуги при autoLoad=true", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: true
    });

    await scope.flush();

    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(deps.listServices).toHaveBeenCalledWith(undefined);
    expect(scope.result.services.value).toEqual(servicesFixture);
  });

  it("учитывает initialFilterDoctorId при первой загрузке", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false,
      initialFilterDoctorId: 2
    });

    await scope.result.init();

    expect(scope.result.filterDoctorId.value).toBe(2);
    expect(deps.listServices).toHaveBeenCalledWith(2);
  });

  it("применяет фильтр по врачу и перезагружает услуги", async () => {
    const deps = createDeps();
    deps.listServices
      .mockResolvedValueOnce(servicesFixture)
      .mockResolvedValueOnce([servicesFixture[1]]);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.filterDoctorId.value = 2;
    await scope.result.applyFilter();

    expect(deps.listServices).toHaveBeenNthCalledWith(2, 2);
    expect(scope.result.services.value).toEqual([servicesFixture[1]]);
  });

  it("создаёт услугу и сбрасывает форму", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    Object.assign(scope.result.form, {
      name: " Контроль ",
      price: 3000,
      doctor_id: 2
    });

    await scope.result.submit();

    expect(deps.createService).toHaveBeenCalledWith({
      name: "Контроль",
      price: 3000,
      doctor_id: 2
    });
    expect(scope.result.editingId.value).toBeNull();
    expect(scope.result.form).toEqual({
      name: "",
      price: 0,
      doctor_id: 1
    });
  });

  it("cancelEdit сбрасывает форму и editingId", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.startEdit(servicesFixture[1]);
    Object.assign(scope.result.form, {
      name: "Другая услуга",
      price: 4500
    });

    scope.result.cancelEdit();

    expect(scope.result.editingId.value).toBeNull();
    expect(scope.result.form).toEqual({
      name: "",
      price: 0,
      doctor_id: 1
    });
  });

  it("не отправляет невалидную форму", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.submit();

    expect(deps.createService).not.toHaveBeenCalled();
    expect(deps.updateService).not.toHaveBeenCalled();
  });

  it("обновляет услугу, возвращает подписи врача и удаляет запись", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.startEdit(servicesFixture[1]);
    Object.assign(scope.result.form, {
      name: " Операция deluxe "
    });

    await scope.result.submit();
    await scope.result.remove(12);

    expect(deps.updateService).toHaveBeenCalledWith(12, {
      name: "Операция deluxe",
      price: 10000,
      doctor_id: 2
    });
    expect(deps.deleteService).toHaveBeenCalledWith(12);
    expect(scope.result.doctorName(2)).toBe("Петров Пётр (Хирург)");
    expect(scope.result.doctorName(999)).toBe("—");
    expect(scope.result.buildDoctorLabel(doctorsFixture[0])).toBe("Иванов Иван — Терапевт");
  });

  it("переключает doctor_id на fallback после refresh, если текущий врач исчез", async () => {
    const deps = createDeps();
    deps.listDoctors
      .mockResolvedValueOnce(doctorsFixture)
      .mockResolvedValueOnce([doctorsFixture[0]]);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.form.doctor_id = 2;

    await scope.result.refresh();

    expect(scope.result.form.doctor_id).toBe(1);
  });

  it("пробрасывает ошибку refresh и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("list failed");
    deps.listDoctors.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.refresh()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку create и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("create failed");
    deps.createService.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    Object.assign(scope.result.form, {
      name: "Новая услуга",
      price: 3000,
      doctor_id: 1
    });

    await expect(scope.result.submit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку update и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("update failed");
    deps.updateService.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.init();
    scope.result.startEdit(servicesFixture[0]);

    await expect(scope.result.submit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку delete и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("delete failed");
    deps.deleteService.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.remove(12)).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });
});
