import api from './api';
import type { InboxItem } from '../types';

export const inboxService = {
  async list(): Promise<InboxItem[]> {
    const { data } = await api.get<InboxItem[]>('/inbox/');
    return data;
  },

  async create(content: string): Promise<InboxItem> {
    const { data } = await api.post<InboxItem>('/inbox/', { content });
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/inbox/${id}/`);
  },

  async toTask(id: number): Promise<void> {
    await api.post(`/inbox/${id}/to-task/`);
  },

  async toNote(id: number): Promise<void> {
    await api.post(`/inbox/${id}/to-note/`);
  },

  async toEvent(id: number): Promise<void> {
    await api.post(`/inbox/${id}/to-event/`);
  },
};
