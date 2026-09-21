import { db } from './db';
import type { Note, Scope, Tag } from '../types';
import { tasksService } from './tasks';

async function hydrate(row: any): Promise<Note> {
  const scope = (await db.scopes.get(row.scope_id)) as Scope;
  const tagRows = row.tag_ids?.length
    ? await db.tags.where('id').anyOf(row.tag_ids).toArray()
    : [];
  return {
    ...row,
    scope: scope || { id: row.scope_id, name: '?', color: '#888', icon: '', position: 0, is_active: true, created_at: '', updated_at: '' },
    tags: tagRows as Tag[],
  } as Note;
}

export const notesService = {
  async list(params?: Record<string, string>): Promise<Note[]> {
    let rows = await db.notes.toArray();
    rows = rows.filter((r) => !r.deleted_at);

    if (params?.scope_id) {
      const sid = Number(params.scope_id);
      rows = rows.filter((r) => r.scope_id === sid);
    }

    rows.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return b.updated_at.localeCompare(a.updated_at);
    });

    return Promise.all(rows.map(hydrate));
  },

  async get(id: number): Promise<Note> {
    const row = await db.notes.get(id);
    if (!row) throw new Error('Note not found');
    return hydrate(row);
  },

  async create(payload: Partial<Note>): Promise<Note> {
    const ts = new Date().toISOString();
    const id = (await db.notes.add({
      scope_id: (payload as any).scope_id ?? payload.scope?.id ?? 0,
      title: payload.title || '',
      content: payload.content || '',
      is_pinned: payload.is_pinned ?? false,
      tag_ids: (payload as any).tag_ids || [],
      deleted_at: null,
      created_at: ts,
      updated_at: ts,
    })) as number;
    return this.get(id);
  },

  async update(id: number, payload: Partial<Note>): Promise<Note> {
    const updates: any = { ...payload, updated_at: new Date().toISOString() };
    if (payload.tags) delete updates.tags;
    if (payload.scope) delete updates.scope;
    await db.notes.update(id, updates);
    return this.get(id);
  },

  async delete(id: number): Promise<void> {
    await db.notes.update(id, { deleted_at: new Date().toISOString() });
  },

  async convertToTask(id: number): Promise<void> {
    const note = await db.notes.get(id);
    if (!note) throw new Error('Note not found');
    await tasksService.create({
      title: note.title || 'Desde nota',
      scope_id: note.scope_id,
      description: note.content,
      tag_ids: note.tag_ids || [],
    });
  },
};
