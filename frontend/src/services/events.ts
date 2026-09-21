import { db } from './db';
import type { Event } from '../types';
import type { Scope } from '../types';

async function hydrate(row: any): Promise<Event> {
  const scope = (await db.scopes.get(row.scope_id)) as Scope;
  return {
    ...row,
    scope: scope || { id: row.scope_id, name: '?', color: '#888', icon: '', position: 0, is_active: true, created_at: '', updated_at: '' },
  } as Event;
}

export const eventsService = {
  async list(params?: Record<string, string>): Promise<Event[]> {
    let rows = await db.events.toArray();
    rows = rows.filter((r) => !r.deleted_at);

    if (params?.scope_id) {
      const sid = Number(params.scope_id);
      rows = rows.filter((r) => r.scope_id === sid);
    }
    if (params?.start) {
      rows = rows.filter((r) => r.start_datetime >= params.start!);
    }
    if (params?.end) {
      rows = rows.filter((r) => r.start_datetime <= params.end! + 'T23:59:59');
    }

    rows.sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
    return Promise.all(rows.map(hydrate));
  },

  async get(id: number): Promise<Event> {
    const row = await db.events.get(id);
    if (!row) throw new Error('Event not found');
    return hydrate(row);
  },

  async create(payload: Partial<Event>): Promise<Event> {
    const ts = new Date().toISOString();
    const id = (await db.events.add({
      scope_id: (payload as any).scope_id ?? payload.scope?.id ?? 0,
      title: payload.title || '',
      description: payload.description || '',
      start_datetime: payload.start_datetime || ts,
      end_datetime: payload.end_datetime || ts,
      all_day: payload.all_day ?? false,
      location: payload.location || '',
      deleted_at: null,
      created_at: ts,
      updated_at: ts,
    })) as number;
    return this.get(id);
  },

  async update(id: number, payload: Partial<Event>): Promise<Event> {
    await db.events.update(id, { ...payload, updated_at: new Date().toISOString() } as any);
    return this.get(id);
  },

  async delete(id: number): Promise<void> {
    await db.events.update(id, { deleted_at: new Date().toISOString() });
  },
};
