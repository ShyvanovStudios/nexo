import { db } from './db';
import type { Tag } from '../types';

function toTag(row: any): Tag {
  return { ...row } as Tag;
}

export const tagsService = {
  async list(): Promise<Tag[]> {
    const rows = await db.tags.orderBy('name').toArray();
    return rows.map(toTag);
  },

  async create(payload: Partial<Tag>): Promise<Tag> {
    const now = new Date().toISOString();
    const id = await db.tags.add({
      name: payload.name || '',
      color: payload.color || '#6b7280',
      created_at: now,
    });
    return toTag(await db.tags.get(id));
  },

  async update(id: number, payload: Partial<Tag>): Promise<Tag> {
    await db.tags.update(id, payload);
    return toTag(await db.tags.get(id));
  },

  async delete(id: number): Promise<void> {
    await db.tags.delete(id);
  },
};
