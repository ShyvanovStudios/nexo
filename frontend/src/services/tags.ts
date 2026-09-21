import api from './api';
import type { Tag } from '../types';

export const tagsService = {
  async list(): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/tags/');
    return data;
  },

  async create(payload: Partial<Tag>): Promise<Tag> {
    const { data } = await api.post<Tag>('/tags/', payload);
    return data;
  },

  async update(id: number, payload: Partial<Tag>): Promise<Tag> {
    const { data } = await api.patch<Tag>(`/tags/${id}/`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tags/${id}/`);
  },
};
