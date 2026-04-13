import { api, API_PREFIX } from "./http/api";

export type Service = {
  id: number;
  name: string;
  price: number;
  doctor_id: number;
  created_at: string;
};

export type ServiceInput = {
  name: string;
  price: number;
  doctor_id: number;
};

export async function listServices(doctorId?: number): Promise<Service[]> {
  const resp = await api.json.get(`${API_PREFIX}/services`, {
    query: doctorId ? { doctor_id: doctorId } : undefined
  });
  return resp.json();
}

export async function getService(id: number): Promise<Service> {
  const resp = await api.json.get(`${API_PREFIX}/services/${id}`);
  return resp.json();
}

export async function createService(input: ServiceInput): Promise<{ id: number }> {
  const resp = await api.json.post(`${API_PREFIX}/services`, input);
  return resp.json();
}

export async function updateService(id: number, input: ServiceInput): Promise<{ ok: true }> {
  const resp = await api.json.put(`${API_PREFIX}/services/${id}`, input);
  return resp.json();
}

export async function deleteService(id: number): Promise<{ ok: true }> {
  const resp = await api.json.delete(`${API_PREFIX}/services/${id}`);
  return resp.json();
}
