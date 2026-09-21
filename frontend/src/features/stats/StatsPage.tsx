import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';

export function StatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.get(),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>;
  }

  const stats = data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Estadísticas</h1>

      {/* Weekly summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Completadas esta semana" value={stats?.weekly_completed ?? 0} color="green" />
        <StatCard label="Vencidas" value={stats?.overdue_tasks?.length ?? 0} color="red" />
        <StatCard label="Bloqueadas" value={stats?.blocked_tasks?.length ?? 0} color="orange" />
        <StatCard label="Activas" value={stats?.today_tasks?.length ?? 0} color="blue" />
      </div>

      {/* Priority distribution */}
      {stats?.priority_summary && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Distribución por prioridad</h2>
          <div className="space-y-3">
            <PriorityBar label="Alta" count={stats.priority_summary.high} total={stats.priority_summary.high + stats.priority_summary.medium + stats.priority_summary.low} color="bg-red-500" />
            <PriorityBar label="Media" count={stats.priority_summary.medium} total={stats.priority_summary.high + stats.priority_summary.medium + stats.priority_summary.low} color="bg-yellow-500" />
            <PriorityBar label="Baja" count={stats.priority_summary.low} total={stats.priority_summary.high + stats.priority_summary.medium + stats.priority_summary.low} color="bg-green-500" />
          </div>
        </div>
      )}

      {/* Scope distribution */}
      {stats?.scope_distribution && stats.scope_distribution.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Distribución por ámbito</h2>
          <div className="space-y-3">
            {stats.scope_distribution.map((s) => (
              <div key={s.scope_name} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 w-24">{s.scope_name}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${s.percentage}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{s.count} ({s.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const textColor = { green: 'text-green-600', red: 'text-red-600', orange: 'text-orange-600', blue: 'text-blue-600' }[color] || 'text-gray-600';
  const bgColor = { green: 'bg-green-50 dark:bg-green-900/20', red: 'bg-red-50 dark:bg-red-900/20', orange: 'bg-orange-50 dark:bg-orange-900/20', blue: 'bg-blue-50 dark:bg-blue-900/20' }[color] || '';

  return (
    <div className={`${bgColor} rounded-xl p-4 text-center`}>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function PriorityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 dark:text-gray-300 w-16">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div className={`${color} h-3 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-16 text-right">{count} ({pct}%)</span>
    </div>
  );
}
