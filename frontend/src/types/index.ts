// === Enums ===

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En proceso',
  BLOCKED: 'Pendiente',
  DONE: 'Completado',
};

export const BlockReason = {
  WAITING_RESPONSE: 'WAITING_RESPONSE',
  DEPENDENCY: 'DEPENDENCY',
  MISSING_INFORMATION: 'MISSING_INFORMATION',
  MISSING_BUDGET: 'MISSING_BUDGET',
  RESCHEDULED: 'RESCHEDULED',
  TECHNICAL_PROBLEM: 'TECHNICAL_PROBLEM',
  OTHER: 'OTHER',
} as const;
export type BlockReason = (typeof BlockReason)[keyof typeof BlockReason];

export const BLOCK_REASON_LABELS: Record<BlockReason, string> = {
  WAITING_RESPONSE: 'Esperando respuesta',
  DEPENDENCY: 'Dependo de otra persona',
  MISSING_INFORMATION: 'Falta información',
  MISSING_BUDGET: 'Falta presupuesto',
  RESCHEDULED: 'Reprogramada',
  TECHNICAL_PROBLEM: 'Problema técnico',
  OTHER: 'Otro',
};

export const HistoryEventType = {
  TASK_CREATED: 'TASK_CREATED',
  TITLE_CHANGED: 'TITLE_CHANGED',
  DESCRIPTION_CHANGED: 'DESCRIPTION_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  SCOPE_CHANGED: 'SCOPE_CHANGED',
  DUE_DATE_CHANGED: 'DUE_DATE_CHANGED',
  TASK_BLOCKED: 'TASK_BLOCKED',
  TASK_UNBLOCKED: 'TASK_UNBLOCKED',
  CHECKLIST_UPDATED: 'CHECKLIST_UPDATED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_REOPENED: 'TASK_REOPENED',
  TASK_ARCHIVED: 'TASK_ARCHIVED',
} as const;
export type HistoryEventType = (typeof HistoryEventType)[keyof typeof HistoryEventType];

export const ImportanceLevel = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
export const UrgencyLevel = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;

export const IMPORTANCE_LABELS: Record<number, string> = { 1: 'Baja', 2: 'Media', 3: 'Alta' };
export const URGENCY_LABELS: Record<number, string> = { 1: 'Baja', 2: 'Media', 3: 'Alta' };

// === Priority helpers ===

export type PriorityColor = 'red' | 'yellow' | 'green' | 'gray';

export function getPriorityColor(score: number): PriorityColor {
  if (score >= 6) return 'red';
  if (score >= 3) return 'yellow';
  if (score >= 1) return 'green';
  return 'gray';
}

export function getPriorityLabel(score: number): string {
  if (score >= 6) return 'Alta';
  if (score >= 3) return 'Media';
  if (score >= 1) return 'Baja';
  return 'Sin prioridad';
}

// === Models ===

export interface Scope {
  id: number;
  name: string;
  color: string;
  icon: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface ChecklistItem {
  id: number;
  task_id: number;
  text: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  completed_at: string | null;
}

export interface Task {
  id: number;
  scope: Scope;
  scope_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  importance: number;
  urgency: number;
  base_priority_score: number;
  effective_priority_score: number;
  due_date: string | null;
  due_time: string | null;
  started_at: string | null;
  blocked_at: string | null;
  completed_at: string | null;
  block_reason: BlockReason | null;
  block_reason_detail: string;
  position: number;
  is_archived: boolean;
  tags: Tag[];
  checklist_items: ChecklistItem[];
  checklist_progress: { completed: number; total: number };
  created_at: string;
  updated_at: string;
}

export interface TaskHistory {
  id: number;
  task_id: number;
  event_type: HistoryEventType;
  previous_value: string;
  new_value: string;
  comment: string;
  created_at: string;
}

export interface Event {
  id: number;
  scope: Scope;
  scope_id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  all_day: boolean;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  scope: Scope;
  scope_id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface InboxItem {
  id: number;
  content: string;
  processed: boolean;
  created_at: string;
  processed_at: string | null;
}

export interface Reminder {
  id: number;
  task_id: number | null;
  event_id: number | null;
  remind_at: string;
  notification_sent: boolean;
  created_at: string;
}

export interface DashboardData {
  today_tasks: Task[];
  overdue_tasks: Task[];
  blocked_tasks: Task[];
  upcoming_events: Event[];
  priority_summary: { high: number; medium: number; low: number };
  weekly_completed: number;
  scope_distribution: { scope_name: string; count: number; percentage: number }[];
}

// === API types ===

export interface TaskCreatePayload {
  title: string;
  scope_id: number;
  description?: string;
  importance?: number;
  urgency?: number;
  due_date?: string | null;
  due_time?: string | null;
  status?: TaskStatus;
  tag_ids?: number[];
}

export interface TaskUpdatePayload extends Partial<TaskCreatePayload> {
  position?: number;
  is_archived?: boolean;
}

export interface BlockTaskPayload {
  block_reason: BlockReason;
  block_reason_detail?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
