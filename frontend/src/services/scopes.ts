import { db } from './db';
import type { Scope } from '../types';

function toScope(row: any): Scope {
  return { ...row } as Scope;
}

export const scopesService = {
  async list(): Promise<Scope[]> {
    const rows = await db.scopes.orderBy('position').toArray();
    return rows.map(toScope);
  },

  async get(id: number): Promise<Scope> {
    const row = await db.scopes.get(id);
    if (!row) throw new Error('Scope not found');
    return toScope(row);
  },

  async create(payload: Partial<Scope>): Promise<Scope> {
    const now = new Date().toISOString();
    const id = await db.scopes.add({
      name: payload.name || '',
      color: payload.color || '#3b82f6',
      icon: payload.icon || '',
      position: payload.position ?? 0,
      is_active: payload.is_active ?? true,
      created_at: now,
      updated_at: now,
    });
    return this.get(id);
  },

  async update(id: number, payload: Partial<Scope>): Promise<Scope> {
    await db.scopes.update(id, { ...payload, updated_at: new Date().toISOString() });
    return this.get(id);
  },

  async delete(id: number): Promise<void> {
    await db.scopes.delete(id);
  },
};
