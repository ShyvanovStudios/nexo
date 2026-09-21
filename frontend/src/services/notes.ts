import api from './api';
import type { Note } from '../types';

export const notesService = {
  async list(params?: Record<string, string>): Promise<Note[]> {
    const { data } = await api.get<Note[]>('/notes/', { params });
    return data;
  },

  async get(id: number): Promise<Note> {
    const { data } = await api.get<Note>(`/notes/${id}/`);
    return data;
  },

  async create(payload: Partial<Note>): Promise<Note> {
    const { data } = await api.post<Note>('/notes/', payload);
    return data;
  },

  async update(id: number, payload: Partial<Note>): Promise<Note> {
    const { data } = await api.patch<Note>(`/notes/${id}/`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/notes/${id}/`);
  },

  async convertToTask(id: number): Promise<void> {
    await api.post(`/notes/${id}/to-task/`);
  },
};
