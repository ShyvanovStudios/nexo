import { db } from './db';
import type { DashboardData, Task, Event, Scope, Tag } from '../types';

async function hydrateTask(row: any): Promise<Task> {
  const scope = (await db.scopes.get(row.scope_id)) as Scope;
  const tagRows = row.tag_ids?.length
    ? await db.tags.where('id').anyOf(row.tag_ids).toArray()
    : [];
  const checklistItems = await db.checklistItems
    .where('task_id')
    .equals(row.id!)
    .sortBy('position');
  const completed = checklistItems.filter((c: any) => c.is_completed).length;

  return {
    ...row,
    scope: scope || { id: row.scope_id, name: '?', color: '#888', icon: '', position: 0, is_active: true, created_at: '', updated_at: '' },
    tags: tagRows as Tag[],
    checklist_items: checklistItems,
    checklist_progress: { completed, total: checklistItems.length },
  } as Task;
}

async function hydrateEvent(row: any): Promise<Event> {
  const scope = (await db.scopes.get(row.scope_id)) as Scope;
  return {
    ...row,
    scope: scope || { id: row.scope_id, name: '?', color: '#888', icon: '', position: 0, is_active: true, created_at: '', updated_at: '' },
  } as Event;
}

export const dashboardService = {
  async get(scopeId?: number): Promise<DashboardData> {
    const today = new Date().toISOString().split('T')[0];
    const nowDate = new Date();
    const weekStart = new Date(nowDate);
    weekStart.setDate(nowDate.getDate() - nowDate.getDay() + 1); // Monday
    const weekStartStr = weekStart.toISOString().split('T')[0];

    let allTasks = await db.tasks.toArray();
    allTasks = allTasks.filter((t) => !t.deleted_at);
    if (scopeId) allTasks = allTasks.filter((t) => t.scope_id === scopeId);

    const activeTasks = allTasks.filter((t) => t.status !== 'DONE' && !t.is_archived);
    const todayTasks = activeTasks.filter((t) => t.due_date === today);
    const overdueTasks = activeTasks.filter((t) => t.due_date && t.due_date < today);
    const blockedTasks = activeTasks.filter((t) => t.status === 'BLOCKED');

    // Priority summary
    const high = activeTasks.filter((t) => t.effective_priority_score >= 6).length;
    const medium = activeTasks.filter((t) => t.effective_priority_score >= 3 && t.effective_priority_score < 6).length;
    const low = activeTasks.filter((t) => t.effective_priority_score < 3).length;

    // Weekly completed
    const weeklyCompleted = allTasks.filter(
      (t) => t.status === 'DONE' && t.completed_at && t.completed_at >= weekStartStr
    ).length;

    // Scope distribution
    const scopeDist: Record<number, number> = {};
    for (const t of activeTasks) {
      scopeDist[t.scope_id] = (scopeDist[t.scope_id] || 0) + 1;
    }
    const total = activeTasks.length;
    const scopes = await db.scopes.toArray();
    const scopeMap = Object.fromEntries(scopes.map((s) => [s.id!, s.name]));
    const scopeDistribution = Object.entries(scopeDist).map(([sid, count]) => ({
      scope_name: scopeMap[Number(sid)] || '?',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    // Upcoming events (next 7 days)
    const in7Days = new Date(Date.now() + 7 * 86400000).toISOString();
    let upcomingEvents = await db.events.toArray();
    upcomingEvents = upcomingEvents.filter(
      (e) => !e.deleted_at && e.start_datetime >= nowDate.toISOString() && e.start_datetime <= in7Days
    );
    if (scopeId) upcomingEvents = upcomingEvents.filter((e) => e.scope_id === scopeId);
    upcomingEvents.sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));

    return {
      today_tasks: await Promise.all(todayTasks.map(hydrateTask)),
      overdue_tasks: await Promise.all(overdueTasks.map(hydrateTask)),
      blocked_tasks: await Promise.all(blockedTasks.map(hydrateTask)),
      upcoming_events: await Promise.all(upcomingEvents.slice(0, 10).map(hydrateEvent)),
      priority_summary: { high, medium, low },
      weekly_completed: weeklyCompleted,
      scope_distribution: scopeDistribution,
    };
  },
};
