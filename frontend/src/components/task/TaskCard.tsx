import type { Task } from '../../types';
import { PriorityBadge } from '../ui/PriorityBadge';
import { ScopeBadge } from '../ui/ScopeBadge';
import { formatRelativeDate } from '../../utils/date';
import { isOverdue } from '../../utils/priority';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export function TaskCard({ task, onClick, dragHandleProps }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.due_time, task.status);
  const hasChecklist = task.checklist_progress.total > 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg border p-3 cursor-pointer hover:shadow-md transition-shadow ${
        overdue
          ? 'border-red-300 dark:border-red-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      role="button"
      tabIndex={0}
      aria-label={task.title}
      {...dragHandleProps}
    >
      {/* Priority + Title */}
      <div className="flex items-start gap-2">
        <PriorityBadge score={task.effective_priority_score} />
        <h4 className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
          {task.title}
        </h4>
        {task.status === 'BLOCKED' && (
          <span className="text-orange-500 flex-shrink-0" title="Bloqueada" aria-label="Tarea bloqueada">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </span>
        )}
      </div>

      {/* Scope */}
      <div className="mt-2">
        <ScopeBadge scope={task.scope} />
      </div>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {task.due_date && (
          <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : ''}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatRelativeDate(task.due_date)}
          </span>
        )}
        {hasChecklist && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.checklist_progress.completed}/{task.checklist_progress.total}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag.name}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-gray-400">+{task.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}
