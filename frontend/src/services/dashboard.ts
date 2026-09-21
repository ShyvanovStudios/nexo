import api from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  async get(scopeId?: number): Promise<DashboardData> {
    const params = scopeId ? { scope_id: String(scopeId) } : undefined;
    const { data } = await api.get<DashboardData>('/dashboard/', { params });
    return data;
  },
};
