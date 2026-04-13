import { api, API_PREFIX } from "./http/api";

export type Appointment = {
  id: number;
  service_id: number;
  total_price: number;
  description: string;
  date: string;
  created_at: string;
};

export type AppointmentInput = {
  service_id: number;
  total_price: number;
  description: string;
  date: string;
};

export async function listAppointments(limit?: number): Promise<Appointment[]> {
  const resp = await api.json.get(`${API_PREFIX}/appointments`, {
    query: limit ? { limit } : undefined
  });
  return resp.json();
}

export async function createAppointment(input: AppointmentInput): Promise<{ id: number }> {
  const resp = await api.json.post(`${API_PREFIX}/appointments`, input);
  return resp.json();
}

export async function updateAppointment(
  id: number,
  input: AppointmentInput
): Promise<{ ok: true }> {
  const resp = await api.json.put(`${API_PREFIX}/appointments/${id}`, input);
  return resp.json();
}

export async function deleteAppointment(id: number): Promise<{ ok: true }> {
  const resp = await api.json.delete(`${API_PREFIX}/appointments/${id}`);
  return resp.json();
}
