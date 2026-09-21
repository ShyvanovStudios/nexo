import api from './api';
import type {
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
  BlockTaskPayload,
  TaskHistory,
  ChecklistItem,
} from '../types';

export const tasksService = {
  async list(params?: Record<string, string>): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks/', { params });
    return data;
  },

  async get(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}/`);
    return data;
  },

  async create(payload: TaskCreatePayload): Promise<Task> {
    const { data } = await api.post<Task>('/tasks/', payload);
    return data;
  },

  async update(id: number, payload: TaskUpdatePayload): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}/`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}/`);
  },

  async start(id: number): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${id}/start/`);
    return data;
  },

  async block(id: number, payload: BlockTaskPayload): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${id}/block/`, payload);
    return data;
  },

  async unblock(id: number): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${id}/unblock/`);
    return data;
  },

  async complete(id: number): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${id}/complete/`);
    return data;
  },

  async reopen(id: number): Promise<Task> {
    const { data } = await api.post<Task>(`/tasks/${id}/reopen/`);
    return data;
  },

  async getHistory(taskId: number): Promise<TaskHistory[]> {
    const { data } = await api.get<TaskHistory[]>(`/tasks/${taskId}/history/`);
    return data;
  },

  // Checklist
  async getChecklist(taskId: number): Promise<ChecklistItem[]> {
    const { data } = await api.get<ChecklistItem[]>(`/tasks/${taskId}/checklist/`);
    return data;
  },

  async addChecklistItem(taskId: number, text: string): Promise<ChecklistItem> {
    const { data } = await api.post<ChecklistItem>(`/tasks/${taskId}/checklist/`, { text });
    return data;
  },

  async updateChecklistItem(id: number, payload: Partial<ChecklistItem>): Promise<ChecklistItem> {
    const { data } = await api.patch<ChecklistItem>(`/checklist/${id}/`, payload);
    return data;
  },

  async deleteChecklistItem(id: number): Promise<void> {
    await api.delete(`/checklist/${id}/`);
  },
};
