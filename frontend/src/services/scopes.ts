import api from './api';
import type { Scope } from '../types';

export const scopesService = {
  async list(): Promise<Scope[]> {
    const { data } = await api.get<Scope[]>('/scopes/');
    return data;
  },

  async get(id: number): Promise<Scope> {
    const { data } = await api.get<Scope>(`/scopes/${id}/`);
    return data;
  },

  async create(payload: Partial<Scope>): Promise<Scope> {
    const { data } = await api.post<Scope>('/scopes/', payload);
    return data;
  },

  async update(id: number, payload: Partial<Scope>): Promise<Scope> {
    const { data } = await api.patch<Scope>(`/scopes/${id}/`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/scopes/${id}/`);
  },
};
