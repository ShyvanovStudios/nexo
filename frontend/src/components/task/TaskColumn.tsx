import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskCard } from './SortableTaskCard';
import type { Task, TaskStatus } from '../../types';
import { TASK_STATUS_LABELS } from '../../types';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const STATUS_COLORS: Record<string, string> = {
  TODO: 'border-gray-400',
  IN_PROGRESS: 'border-blue-500',
  BLOCKED: 'border-orange-500',
  DONE: 'border-green-500',
};

export function TaskColumn({ status, tasks, onTaskClick }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`flex flex-col min-w-[280px] max-w-[340px] w-full bg-gray-100 dark:bg-gray-900 rounded-xl ${
        isOver ? 'ring-2 ring-primary-400' : ''
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 px-4 py-3 border-t-4 rounded-t-xl ${STATUS_COLORS[status]}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin min-h-[200px]"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-8">
            Sin tareas
          </p>
        )}
      </div>
    </div>
  );
}
