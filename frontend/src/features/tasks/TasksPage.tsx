import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskBoard } from '../../components/task/TaskBoard';
import { useTasks, useMoveTask, useBlockTask } from '../../hooks/useTasks';
import { useFilterStore } from '../../stores/filterStore';
import { useScopes } from '../../hooks/useScopes';
import type { Task, BlockTaskPayload } from '../../types';

export function TasksPage() {
  const navigate = useNavigate();
  const { scopeId, setScopeId } = useFilterStore();
  const { data: scopes } = useScopes();
  const [view, setView] = useState<'kanban' | 'eisenhower'>('kanban');

  const params: Record<string, string> = {};
  if (scopeId) params.scope_id = String(scopeId);

  const { data: tasks = [], isLoading } = useTasks(params);
  const moveTask = useMoveTask();
  const blockTask = useBlockTask();

  const handleTaskClick = (task: Task) => {
    navigate(`/tareas/${task.id}`);
  };

  const handleTaskMove = (taskId: number, newStatus: string) => {
    moveTask.mutate({ id: taskId, status: newStatus });
  };

  const handleTaskBlock = (taskId: number, payload: BlockTaskPayload) => {
    blockTask.mutate({ id: taskId, payload });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tareas</h1>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-2 text-xs font-medium min-h-[40px] ${
                view === 'kanban'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('eisenhower')}
              className={`px-3 py-2 text-xs font-medium min-h-[40px] ${
                view === 'eisenhower'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Eisenhower
            </button>
          </div>

          <button
            onClick={() => navigate('/tareas/nueva')}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors min-h-[44px]"
          >
            + Nueva tarea
          </button>
        </div>
      </div>

      {/* Scope filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setScopeId(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] ${
            !scopeId
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Todas
        </button>
        {scopes?.map((s) => (
          <button
            key={s.id}
            onClick={() => setScopeId(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] ${
              scopeId === s.id
                ? 'text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
            style={scopeId === s.id ? { backgroundColor: s.color } : undefined}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Board */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>
      ) : view === 'kanban' ? (
        <TaskBoard
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
          onTaskBlock={handleTaskBlock}
        />
      ) : (
        <EisenhowerView tasks={tasks} onTaskClick={handleTaskClick} />
      )}
    </div>
  );
}

function EisenhowerView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (t: Task) => void }) {
  const q1 = tasks.filter((t) => t.importance >= 3 && t.urgency >= 3 && t.status !== 'DONE');
  const q2 = tasks.filter((t) => t.importance >= 3 && t.urgency < 3 && t.status !== 'DONE');
  const q3 = tasks.filter((t) => t.importance < 3 && t.urgency >= 3 && t.status !== 'DONE');
  const q4 = tasks.filter((t) => t.importance < 3 && t.urgency < 3 && t.status !== 'DONE');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Quadrant title="Hacer ahora" subtitle="Importante + Urgente" tasks={q1} color="red" onTaskClick={onTaskClick} />
      <Quadrant title="Planificar" subtitle="Importante + No urgente" tasks={q2} color="blue" onTaskClick={onTaskClick} />
      <Quadrant title="Revisar / Delegar" subtitle="No importante + Urgente" tasks={q3} color="yellow" onTaskClick={onTaskClick} />
      <Quadrant title="Baja prioridad" subtitle="No importante + No urgente" tasks={q4} color="gray" onTaskClick={onTaskClick} />
    </div>
  );
}

function Quadrant({ title, subtitle, tasks, color, onTaskClick }: {
  title: string; subtitle: string; tasks: Task[]; color: string; onTaskClick: (t: Task) => void;
}) {
  const borderColor = { red: 'border-red-300', blue: 'border-blue-300', yellow: 'border-yellow-300', gray: 'border-gray-300' }[color] || 'border-gray-300';
  return (
    <div className={`border-2 ${borderColor} rounded-xl p-4 min-h-[200px]`}>
      <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            onClick={() => onTaskClick(t)}
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded p-1"
          >
            <span className="text-gray-800 dark:text-gray-200">{t.title}</span>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-xs text-gray-400">Sin tareas</p>}
      </ul>
    </div>
  );
}
