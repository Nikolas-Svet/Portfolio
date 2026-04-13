import { afterEach, describe, expect, it, vi } from "vitest";
import type { Doctor, DoctorInput } from "../api/doctors";
import { withSetup, type WithSetupResult } from "../test/utils/withSetup";
import { useDoctors } from "./useDoctors";

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

function createDeps() {
  return {
    listDoctors: vi.fn<() => Promise<Doctor[]>>().mockResolvedValue([]),
    createDoctor: vi.fn<(input: DoctorInput) => Promise<{ id: number }>>().mockResolvedValue({ id: 1 }),
    updateDoctor: vi
      .fn<(id: number, input: DoctorInput) => Promise<{ ok: true }>>()
      .mockResolvedValue({ ok: true }),
    deleteDoctor: vi.fn<(id: number) => Promise<{ ok: true }>>().mockResolvedValue({ ok: true })
  };
}

const scopes: Array<WithSetupResult<unknown>> = [];

function mountComposable(options?: Parameters<typeof useDoctors>[0]) {
  const scope = withSetup(() => useDoctors(options));
  scopes.push(scope as WithSetupResult<unknown>);
  return scope;
}

describe("Composable врачей", () => {
  afterEach(async () => {
    vi.restoreAllMocks();

    while (scopes.length > 0) {
      await scopes.pop()?.cleanup();
    }
  });

  it("автоматически загружает врачей при монтировании", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValue(doctorsFixture);

    const scope = mountComposable({
      deps,
      autoLoad: true
    });

    await scope.flush();

    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(scope.result.doctors.value).toEqual(doctorsFixture);
  });

  it("не делает скрытых запросов при autoLoad=false и позволяет явно вызвать init", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValue(doctorsFixture);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.flush();
    expect(deps.listDoctors).not.toHaveBeenCalled();

    await scope.result.init();
    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
  });

  it("создаёт врача, обновляет список и сбрасывает форму", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValue([doctorsFixture[0]]);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    Object.assign(scope.result.form, {
      doctor_type: " Терапевт ",
      full_name: " Сидоров Сидор "
    });

    await scope.result.submit();

    expect(deps.createDoctor).toHaveBeenCalledWith({
      doctor_type: "Терапевт",
      full_name: "Сидоров Сидор"
    });
    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
    expect(scope.result.form).toEqual({
      doctor_type: "",
      full_name: ""
    });
    expect(scope.result.editingId.value).toBeNull();
  });

  it("обновляет врача в режиме редактирования", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValue(doctorsFixture);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    scope.result.startEdit(doctorsFixture[0]);
    Object.assign(scope.result.form, {
      full_name: " Петров Пётр "
    });

    await scope.result.submit();

    expect(deps.updateDoctor).toHaveBeenCalledWith(1, {
      doctor_type: "Терапевт",
      full_name: "Петров Пётр"
    });
    expect(scope.result.editingId.value).toBeNull();
  });

  it("cancelEdit сбрасывает форму и editingId", async () => {
    const deps = createDeps();
    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    scope.result.startEdit(doctorsFixture[1]);
    Object.assign(scope.result.form, {
      doctor_type: "Кардиолог",
      full_name: "Новый Доктор"
    });

    scope.result.cancelEdit();

    expect(scope.result.editingId.value).toBeNull();
    expect(scope.result.form).toEqual({
      doctor_type: "",
      full_name: ""
    });
  });

  it("не отправляет невалидную форму и удаляет врача через отдельный метод", async () => {
    const deps = createDeps();
    deps.listDoctors.mockResolvedValue(doctorsFixture);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await scope.result.submit();
    expect(deps.createDoctor).not.toHaveBeenCalled();
    expect(deps.updateDoctor).not.toHaveBeenCalled();

    await scope.result.remove(2);

    expect(deps.deleteDoctor).toHaveBeenCalledWith(2);
    expect(deps.listDoctors).toHaveBeenCalledTimes(1);
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
    deps.createDoctor.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    Object.assign(scope.result.form, {
      doctor_type: "Терапевт",
      full_name: "Иванов Иван"
    });

    await expect(scope.result.submit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
    expect(deps.listDoctors).not.toHaveBeenCalled();
  });

  it("пробрасывает ошибку update и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("update failed");
    deps.updateDoctor.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    scope.result.startEdit(doctorsFixture[0]);

    await expect(scope.result.submit()).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });

  it("пробрасывает ошибку delete и сбрасывает loading", async () => {
    const deps = createDeps();
    const error = new Error("delete failed");
    deps.deleteDoctor.mockRejectedValueOnce(error);

    const scope = mountComposable({
      deps,
      autoLoad: false
    });

    await expect(scope.result.remove(2)).rejects.toThrow(error);
    expect(scope.result.loading.value).toBe(false);
  });
});
