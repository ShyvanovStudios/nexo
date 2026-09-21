import { db } from './db';
import type { InboxItem } from '../types';
import { tasksService } from './tasks';

export const inboxService = {
  async list(): Promise<InboxItem[]> {
    const rows = await db.inboxItems.orderBy('created_at').reverse().toArray();
    return rows as InboxItem[];
  },

  async create(content: string): Promise<InboxItem> {
    const id = await db.inboxItems.add({
      content,
      processed: false,
      created_at: new Date().toISOString(),
      processed_at: null,
    });
    return (await db.inboxItems.get(id)) as InboxItem;
  },

  async delete(id: number): Promise<void> {
    await db.inboxItems.delete(id);
  },

  async toTask(id: number): Promise<void> {
    const item = await db.inboxItems.get(id);
    if (!item) return;
    const scope = await db.scopes.orderBy('position').first();
    if (!scope) return;
    await tasksService.create({ title: item.content, scope_id: scope.id! });
    await db.inboxItems.update(id, { processed: true, processed_at: new Date().toISOString() });
  },

  async toNote(id: number): Promise<void> {
    const item = await db.inboxItems.get(id);
    if (!item) return;
    const scope = await db.scopes.orderBy('position').first();
    if (!scope) return;
    const ts = new Date().toISOString();
    await db.notes.add({
      scope_id: scope.id!,
      title: item.content.slice(0, 100),
      content: item.content,
      is_pinned: false,
      tag_ids: [],
      deleted_at: null,
      created_at: ts,
      updated_at: ts,
    });
    await db.inboxItems.update(id, { processed: true, processed_at: ts });
  },

  async toEvent(id: number): Promise<void> {
    const item = await db.inboxItems.get(id);
    if (!item) return;
    const scope = await db.scopes.orderBy('position').first();
    if (!scope) return;
    const ts = new Date().toISOString();
    const endTs = new Date(Date.now() + 3600000).toISOString();
    await db.events.add({
      scope_id: scope.id!,
      title: item.content.slice(0, 100),
      description: '',
      start_datetime: ts,
      end_datetime: endTs,
      all_day: false,
      location: '',
      deleted_at: null,
      created_at: ts,
      updated_at: ts,
    });
    await db.inboxItems.update(id, { processed: true, processed_at: ts });
  },
};
