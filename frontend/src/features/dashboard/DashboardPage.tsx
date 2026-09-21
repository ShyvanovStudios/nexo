import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { ScopeBadge } from '../../components/ui/ScopeBadge';
import { getGreeting, formatRelativeDate, formatTime } from '../../utils/date';
import { useFilterStore } from '../../stores/filterStore';
import { useScopes } from '../../hooks/useScopes';
import type { Task } from '../../types';

export function DashboardPage() {
  const scopeId = useFilterStore((s) => s.scopeId);
  const setScopeId = useFilterStore((s) => s.setScopeId);
  const { data: scopes } = useScopes();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', scopeId],
    queryFn: () => dashboardService.get(scopeId ?? undefined),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {getGreeting()}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Scope filter */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip label="Todos" active={!scopeId} onClick={() => setScopeId(null)} />
        {scopes?.map((s) => (
          <FilterChip
            key={s.id}
            label={s.name}
            active={scopeId === s.id}
            onClick={() => setScopeId(s.id)}
            color={s.color}
          />
        ))}
      </div>

      {/* Priority summary */}
      {data?.priority_summary && (
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard count={data.priority_summary.high} label="Críticas" color="red" />
          <SummaryCard count={data.priority_summary.medium} label="Importantes" color="yellow" />
          <SummaryCard count={data.priority_summary.low} label="Normales" color="green" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today tasks */}
        <Section title="Para hoy" tasks={data?.today_tasks} emptyMsg="Sin tareas para hoy" />

        {/* Upcoming events */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Próximos eventos
          </h2>
          {data?.upcoming_events && data.upcoming_events.length > 0 ? (
            <ul className="space-y-2">
              {data.upcoming_events.map((evt) => (
                <li key={evt.id} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-gray-500">
                    {formatTime(evt.start_datetime.split('T')[1] || '00:00')}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">{evt.title}</span>
                  <ScopeBadge scope={evt.scope} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Sin eventos próximos</p>
          )}
        </div>

        {/* Overdue */}
        <Section title="Tareas vencidas" tasks={data?.overdue_tasks} emptyMsg="Sin tareas vencidas" variant="danger" />

        {/* Blocked */}
        <Section title="Tareas bloqueadas" tasks={data?.blocked_tasks} emptyMsg="Sin tareas bloqueadas" variant="warning" />
      </div>

      {/* Weekly stats */}
      {data?.weekly_completed !== undefined && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          Tareas completadas esta semana: <strong className="text-gray-800 dark:text-gray-200">{data.weekly_completed}</strong>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick, color }: {
  label: string; active: boolean; onClick: () => void; color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
        active
          ? 'text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      style={active ? { backgroundColor: color || '#3b82f6' } : undefined}
    >
      {label}
    </button>
  );
}

function SummaryCard({ count, label, color }: { count: number; label: string; color: string }) {
  const bg = { red: 'bg-red-50 dark:bg-red-900/20', yellow: 'bg-yellow-50 dark:bg-yellow-900/20', green: 'bg-green-50 dark:bg-green-900/20' }[color] || '';
  const text = { red: 'text-red-600 dark:text-red-400', yellow: 'text-yellow-600 dark:text-yellow-400', green: 'text-green-600 dark:text-green-400' }[color] || '';
  const dot = { red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-green-500' }[color] || '';

  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <div className="flex items-center justify-center gap-2">
        <span className={`w-3 h-3 rounded-full ${dot}`} />
        <span className={`text-2xl font-bold ${text}`}>{count}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function Section({ title, tasks, emptyMsg, variant }: {
  title: string; tasks?: Task[]; emptyMsg: string; variant?: 'danger' | 'warning';
}) {
  const borderColor = variant === 'danger' ? 'border-red-200 dark:border-red-800' : variant === 'warning' ? 'border-orange-200 dark:border-orange-800' : 'border-gray-200 dark:border-gray-800';
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border ${borderColor} p-4`}>
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{title}</h2>
      {tasks && tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <PriorityBadge score={t.effective_priority_score} />
              <span className="text-gray-800 dark:text-gray-200">{t.title}</span>
              {t.due_date && (
                <span className="ml-auto text-xs text-gray-400">
                  {formatRelativeDate(t.due_date)}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">{emptyMsg}</p>
      )}
    </div>
  );
}
