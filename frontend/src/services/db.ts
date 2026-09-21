import Dexie, { type EntityTable } from 'dexie';

// === Local DB interfaces (stored in IndexedDB) ===

export interface DbScope {
  id?: number;
  name: string;
  color: string;
  icon: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTag {
  id?: number;
  name: string;
  color: string;
  created_at: string;
}

export interface DbTask {
  id?: number;
  scope_id: number;
  title: string;
  description: string;
  status: string;
  importance: number;
  urgency: number;
  base_priority_score: number;
  effective_priority_score: number;
  due_date: string | null;
  due_time: string | null;
  started_at: string | null;
  blocked_at: string | null;
  completed_at: string | null;
  block_reason: string;
  block_reason_detail: string;
  position: number;
  is_archived: boolean;
  tag_ids: number[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbChecklistItem {
  id?: number;
  task_id: number;
  text: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  completed_at: string | null;
}

export interface DbTaskHistory {
  id?: number;
  task_id: number;
  event_type: string;
  previous_value: string;
  new_value: string;
  comment: string;
  created_at: string;
}

export interface DbEvent {
  id?: number;
  scope_id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  all_day: boolean;
  location: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbNote {
  id?: number;
  scope_id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  tag_ids: number[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbInboxItem {
  id?: number;
  content: string;
  processed: boolean;
  created_at: string;
  processed_at: string | null;
}

// === Database ===

class NexoDB extends Dexie {
  scopes!: EntityTable<DbScope, 'id'>;
  tags!: EntityTable<DbTag, 'id'>;
  tasks!: EntityTable<DbTask, 'id'>;
  checklistItems!: EntityTable<DbChecklistItem, 'id'>;
  taskHistory!: EntityTable<DbTaskHistory, 'id'>;
  events!: EntityTable<DbEvent, 'id'>;
  notes!: EntityTable<DbNote, 'id'>;
  inboxItems!: EntityTable<DbInboxItem, 'id'>;

  constructor() {
    super('nexo');

    this.version(1).stores({
      scopes: '++id, name, position',
      tags: '++id, name',
      tasks: '++id, scope_id, status, is_archived, due_date, effective_priority_score, deleted_at',
      checklistItems: '++id, task_id',
      taskHistory: '++id, task_id',
      events: '++id, scope_id, start_datetime, deleted_at',
      notes: '++id, scope_id, is_pinned, deleted_at',
      inboxItems: '++id, processed',
    });
  }
}

export const db = new NexoDB();

// === Seed initial data ===

export async function seedIfEmpty() {
  const scopeCount = await db.scopes.count();
  if (scopeCount > 0) return;

  const now = new Date().toISOString();

  // Scopes
  await db.scopes.bulkAdd([
    { name: 'Trabajo', color: '#3b82f6', icon: 'briefcase', position: 0, is_active: true, created_at: now, updated_at: now },
    { name: 'Casa', color: '#22c55e', icon: 'home', position: 1, is_active: true, created_at: now, updated_at: now },
    { name: 'Empresa', color: '#f97316', icon: 'building', position: 2, is_active: true, created_at: now, updated_at: now },
  ]);

  // Tags
  const tagNames = [
    'UTP', 'Dirección', 'Docentes', 'Estudiantes', 'Prácticas', 'Titulación', 'Reuniones', 'Informes',
    'Compras', 'Mantención', 'Pagos', 'Limpieza', 'Mascotas',
    'Finanzas', 'Proveedores', 'Clientes', 'Ventas', 'Administración', 'Marketing',
  ];
  await db.tags.bulkAdd(
    tagNames.map((name) => ({ name, color: '#6b7280', created_at: now }))
  );
}
