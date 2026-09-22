import { db } from './db';
import type { DbTask } from './db';
import type {
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
  BlockTaskPayload,
  TaskHistory,
  ChecklistItem,
  Scope,
  Tag,
} from '../types';
import { calculateBasePriority, calculateEffectivePriority } from '../utils/priority';

// === Hydrate a DbTask into a full Task with scope, tags, checklist ===

async function hydrate(row: DbTask): Promise<Task> {
  const scope = (await db.scopes.get(row.scope_id)) as Scope;
  const tagRows = row.tag_ids?.length
    ? await db.tags.where('id').anyOf(row.tag_ids).toArray()
    : [];
  const checklistItems = await db.checklistItems
    .where('task_id')
    .equals(row.id!)
    .sortBy('position');
  const completed = checklistItems.filter((c) => c.is_completed).length;

  return {
    ...row,
    id: row.id!,
    scope: scope || { id: row.scope_id, name: '?', color: '#888', icon: '', position: 0, is_active: true, created_at: '', updated_at: '' },
    tags: tagRows as Tag[],
    checklist_items: checklistItems as ChecklistItem[],
    checklist_progress: { completed, total: checklistItems.length },
  } as Task;
}

async function hydrateMany(rows: DbTask[]): Promise<Task[]> {
  return Promise.all(rows.map(hydrate));
}

function now() {
  return new Date().toISOString();
}

async function addHistory(
  taskId: number,
  eventType: string,
  previousValue = '',
  newValue = '',
  comment = ''
) {
  await db.taskHistory.add({
    task_id: taskId,
    event_type: eventType,
    previous_value: previousValue,
    new_value: newValue,
    comment,
    created_at: now(),
  });
}

export const tasksService = {
  async list(params?: Record<string, string>): Promise<Task[]> {
    let rows = await db.tasks.toArray();
    rows = rows.filter((r) => !r.deleted_at);

    if (params?.scope_id) {
      const sid = Number(params.scope_id);
      rows = rows.filter((r) => r.scope_id === sid);
    }
    if (params?.status) {
      rows = rows.filter((r) => r.status === params.status);
    }
    if (params?.is_archived !== undefined) {
      const archived = params.is_archived === 'true';
      rows = rows.filter((r) => r.is_archived === archived);
    }
    if (params?.due_date_gte) {
      rows = rows.filter((r) => r.due_date && r.due_date >= params.due_date_gte!);
    }
    if (params?.due_date_lte) {
      rows = rows.filter((r) => r.due_date && r.due_date <= params.due_date_lte!);
    }

    // Sort: overdue first, then by effective_priority desc, then position
    rows.sort((a, b) => {
      if (b.effective_priority_score !== a.effective_priority_score)
        return b.effective_priority_score - a.effective_priority_score;
      return a.position - b.position;
    });

    return hydrateMany(rows);
  },

  async get(id: number): Promise<Task> {
    const row = await db.tasks.get(id);
    if (!row) throw new Error('Task not found');
    return hydrate(row);
  },

  async create(payload: TaskCreatePayload): Promise<Task> {
    const ts = now();
    const importance = payload.importance ?? 2;
    const urgency = payload.urgency ?? 2;
    const dueDate = payload.due_date || null;
    const dueTime = payload.due_time || null;
    const base = calculateBasePriority(importance, urgency);
    const effective = calculateEffectivePriority(importance, urgency, dueDate, dueTime);

    const id = (await db.tasks.add({
      scope_id: payload.scope_id,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'TODO',
      importance,
      urgency,
      base_priority_score: base,
      effective_priority_score: effective,
      due_date: dueDate,
      due_time: dueTime,
      started_at: null,
      blocked_at: null,
      completed_at: null,
      block_reason: '',
      block_reason_detail: '',
      position: 0,
      is_archived: false,
      tag_ids: payload.tag_ids || [],
      deleted_at: null,
      created_at: ts,
      updated_at: ts,
    })) as number;

    await addHistory(id, 'TASK_CREATED');
    return this.get(id);
  },

  async update(id: number, payload: TaskUpdatePayload): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');

    const updates: Partial<DbTask> = { ...payload, updated_at: now() };

    // Recalculate priority if importance/urgency/due_date changed
    const importance = payload.importance ?? task.importance;
    const urgency = payload.urgency ?? task.urgency;
    const dueDate = payload.due_date !== undefined ? payload.due_date : task.due_date;
    const dueTime = payload.due_time !== undefined ? payload.due_time : task.due_time;
    updates.base_priority_score = calculateBasePriority(importance, urgency);
    updates.effective_priority_score = calculateEffectivePriority(importance, urgency, dueDate ?? null, dueTime ?? null);

    // Track changes
    if (payload.title && payload.title !== task.title) {
      await addHistory(id, 'TITLE_CHANGED', task.title, payload.title);
    }
    if (payload.status && payload.status !== task.status) {
      await addHistory(id, 'STATUS_CHANGED', task.status, payload.status);
    }
    if (payload.scope_id && payload.scope_id !== task.scope_id) {
      await addHistory(id, 'SCOPE_CHANGED', String(task.scope_id), String(payload.scope_id));
    }
    if (payload.due_date !== undefined && payload.due_date !== task.due_date) {
      await addHistory(id, 'DUE_DATE_CHANGED', task.due_date || '', payload.due_date || '');
    }

    if (payload.tag_ids) {
      updates.tag_ids = payload.tag_ids;
    }

    await db.tasks.update(id, updates);
    return this.get(id);
  },

  async delete(id: number): Promise<void> {
    await db.tasks.update(id, { deleted_at: now() });
  },

  async start(id: number): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');
    await db.tasks.update(id, { status: 'IN_PROGRESS', started_at: now(), updated_at: now() });
    await addHistory(id, 'STATUS_CHANGED', task.status, 'IN_PROGRESS');
    return this.get(id);
  },

  async block(id: number, payload: BlockTaskPayload): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');
    await db.tasks.update(id, {
      status: 'BLOCKED',
      blocked_at: now(),
      block_reason: payload.block_reason,
      block_reason_detail: payload.block_reason_detail || '',
      updated_at: now(),
    });
    await addHistory(id, 'TASK_BLOCKED', task.status, 'BLOCKED', `${payload.block_reason}: ${payload.block_reason_detail || ''}`.trim());
    return this.get(id);
  },

  async unblock(id: number): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');
    await db.tasks.update(id, {
      status: 'IN_PROGRESS',
      blocked_at: null,
      block_reason: '',
      block_reason_detail: '',
      updated_at: now(),
    });
    await addHistory(id, 'TASK_UNBLOCKED', 'BLOCKED', 'IN_PROGRESS');
    return this.get(id);
  },

  async complete(id: number): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');
    await db.tasks.update(id, {
      status: 'DONE',
      completed_at: now(),
      blocked_at: null,
      block_reason: '',
      block_reason_detail: '',
      updated_at: now(),
    });
    await addHistory(id, 'TASK_COMPLETED', task.status, 'DONE');
    return this.get(id);
  },

  async reopen(id: number): Promise<Task> {
    const task = await db.tasks.get(id);
    if (!task) throw new Error('Task not found');
    await db.tasks.update(id, {
      status: 'TODO',
      completed_at: null,
      updated_at: now(),
    });
    await addHistory(id, 'TASK_REOPENED', 'DONE', 'TODO');
    return this.get(id);
  },

  async getHistory(taskId: number): Promise<TaskHistory[]> {
    const rows = await db.taskHistory
      .where('task_id')
      .equals(taskId)
      .reverse()
      .sortBy('created_at');
    return rows as TaskHistory[];
  },

  // Checklist
  async getChecklist(taskId: number): Promise<ChecklistItem[]> {
    return (await db.checklistItems
      .where('task_id')
      .equals(taskId)
      .sortBy('position')) as ChecklistItem[];
  },

  async addChecklistItem(taskId: number, text: string): Promise<ChecklistItem> {
    const id = await db.checklistItems.add({
      task_id: taskId,
      text,
      is_completed: false,
      position: 0,
      created_at: now(),
      completed_at: null,
    });
    return (await db.checklistItems.get(id)) as ChecklistItem;
  },

  async updateChecklistItem(id: number, payload: Partial<ChecklistItem>): Promise<ChecklistItem> {
    const updates: any = { ...payload };
    if (payload.is_completed === true) {
      updates.completed_at = now();
    } else if (payload.is_completed === false) {
      updates.completed_at = null;
    }
    await db.checklistItems.update(id, updates);
    return (await db.checklistItems.get(id)) as ChecklistItem;
  },

  async deleteChecklistItem(id: number): Promise<void> {
    await db.checklistItems.delete(id);
  },
};
