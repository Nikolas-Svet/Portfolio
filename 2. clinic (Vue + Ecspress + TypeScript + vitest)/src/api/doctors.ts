import { api, API_PREFIX } from "./http/api";

export type Doctor = {
  id: number;
  doctor_type: string;
  full_name: string;
  created_at: string;
};

export type DoctorInput = {
  doctor_type: string;
  full_name: string;
};

export async function listDoctors(): Promise<Doctor[]> {
  const resp = await api.json.get(`${API_PREFIX}/doctors`);
  return resp.json();
}

export async function getDoctor(id: number): Promise<Doctor> {
  const resp = await api.json.get(`${API_PREFIX}/doctors/${id}`);
  return resp.json();
}

export async function createDoctor(input: DoctorInput): Promise<{ id: number }> {
  const resp = await api.json.post(`${API_PREFIX}/doctors`, input);
  return resp.json();
}

export async function updateDoctor(id: number, input: DoctorInput): Promise<{ ok: true }> {
  const resp = await api.json.put(`${API_PREFIX}/doctors/${id}`, input);
  return resp.json();
}

export async function deleteDoctor(id: number): Promise<{ ok: true }> {
  const resp = await api.json.delete(`${API_PREFIX}/doctors/${id}`);
  return resp.json();
}
