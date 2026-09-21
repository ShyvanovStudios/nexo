import api from './api';
import type { AuthTokens, User } from '../types';

export const authService = {
  async login(username: string, password: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/login/', { username, password });
    localStorage.setItem('nexo_tokens', JSON.stringify(data));
    return data;
  },

  async logout(): Promise<void> {
    const tokens = localStorage.getItem('nexo_tokens');
    if (tokens) {
      try {
        const { refresh } = JSON.parse(tokens);
        await api.post('/auth/logout/', { refresh });
      } catch {
        // ignore logout errors
      }
    }
    localStorage.removeItem('nexo_tokens');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me/');
    return data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('nexo_tokens');
  },
};
