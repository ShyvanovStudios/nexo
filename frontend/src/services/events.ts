import api from './api';
import type { Event } from '../types';

export const eventsService = {
  async list(params?: Record<string, string>): Promise<Event[]> {
    const { data } = await api.get<Event[]>('/events/', { params });
    return data;
  },

  async get(id: number): Promise<Event> {
    const { data } = await api.get<Event>(`/events/${id}/`);
    return data;
  },

  async create(payload: Partial<Event>): Promise<Event> {
    const { data } = await api.post<Event>('/events/', payload);
    return data;
  },

  async update(id: number, payload: Partial<Event>): Promise<Event> {
    const { data } = await api.patch<Event>(`/events/${id}/`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/events/${id}/`);
  },
};
