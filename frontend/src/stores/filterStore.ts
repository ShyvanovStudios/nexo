import { create } from 'zustand';
import type { TaskStatus } from '../types';

interface FilterState {
  scopeId: number | null;
  status: TaskStatus | null;
  priorityColor: string | null;
  tagId: number | null;
  search: string;
  quickFilter: string | null;
  setScopeId: (id: number | null) => void;
  setStatus: (status: TaskStatus | null) => void;
  setPriorityColor: (color: string | null) => void;
  setTagId: (id: number | null) => void;
  setSearch: (search: string) => void;
  setQuickFilter: (filter: string | null) => void;
  clearAll: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  scopeId: null,
  status: null,
  priorityColor: null,
  tagId: null,
  search: '',
  quickFilter: null,
  setScopeId: (scopeId) => set({ scopeId }),
  setStatus: (status) => set({ status }),
  setPriorityColor: (priorityColor) => set({ priorityColor }),
  setTagId: (tagId) => set({ tagId }),
  setSearch: (search) => set({ search }),
  setQuickFilter: (quickFilter) => set({ quickFilter }),
  clearAll: () =>
    set({ scopeId: null, status: null, priorityColor: null, tagId: null, search: '', quickFilter: null }),
}));
