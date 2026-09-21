import { differenceInDays, differenceInHours, parseISO, startOfDay } from 'date-fns';

/**
 * Calculate base priority score: importance * urgency
 */
export function calculateBasePriority(importance: number, urgency: number): number {
  return importance * urgency;
}

/**
 * Calculate dynamic priority boost based on proximity to due date
 * > 7 days: +0, 4-7 days: +1, 2-3 days: +2, <24h: +3, overdue: max (9)
 */
export function calculateDueDateBoost(dueDate: string | null, dueTime: string | null): number {
  if (!dueDate) return 0;

  const now = new Date();
  let due: Date;

  if (dueTime) {
    due = parseISO(`${dueDate}T${dueTime}`);
    const hoursLeft = differenceInHours(due, now);
    if (hoursLeft < 0) return 99; // overdue
    if (hoursLeft <= 24) return 3;
  } else {
    due = startOfDay(parseISO(dueDate));
    const daysLeft = differenceInDays(due, startOfDay(now));
    if (daysLeft < 0) return 99; // overdue
    if (daysLeft <= 1) return 3;
  }

  const daysLeft = differenceInDays(due, now);
  if (daysLeft <= 3) return 2;
  if (daysLeft <= 7) return 1;
  return 0;
}

/**
 * Calculate effective priority score (capped at 9 for normal, 99 for overdue)
 */
export function calculateEffectivePriority(
  importance: number,
  urgency: number,
  dueDate: string | null,
  dueTime: string | null
): number {
  const base = calculateBasePriority(importance, urgency);
  const boost = calculateDueDateBoost(dueDate, dueTime);
  if (boost >= 99) return 99; // overdue is always critical
  return Math.min(base + boost, 9);
}

/**
 * Check if a task is overdue
 */
export function isOverdue(dueDate: string | null, dueTime: string | null, status: string): boolean {
  if (status === 'DONE' || !dueDate) return false;
  const now = new Date();
  const due = dueTime ? parseISO(`${dueDate}T${dueTime}`) : startOfDay(parseISO(dueDate));
  return due < now;
}
