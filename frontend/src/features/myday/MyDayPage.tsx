import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { ScopeBadge } from '../../components/ui/ScopeBadge';
import { BLOCK_REASON_LABELS } from '../../types';
import type { BlockReason } from '../../types';
import { formatTime } from '../../utils/date';

export function MyDayPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.get(),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Cargando...</div>;
  }

  const urgent = data?.today_tasks?.filter((t) => t.effective_priority_score >= 6) ?? [];
  const important = data?.today_tasks?.filter((t) => t.effective_priority_score >= 3 && t.effective_priority_score < 6) ?? [];
  const blocked = data?.blocked_tasks ?? [];
  const events = data?.upcoming_events ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mi Día</h1>

      {/* Urgent */}
      {urgent.length > 0 && (
        <section className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <h2 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Urgente</h2>
          <ul className="space-y-2">
            {urgent.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <PriorityBadge score={t.effective_priority_score} />
                <span className="text-gray-800 dark:text-gray-200">{t.title}</span>
                <ScopeBadge scope={t.scope} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Important */}
      {important.length > 0 && (
        <section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-3">Importante</h2>
          <ul className="space-y-2">
            {important.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <PriorityBadge score={t.effective_priority_score} />
                <span className="text-gray-800 dark:text-gray-200">{t.title}</span>
                <ScopeBadge scope={t.scope} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Agenda */}
      {events.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Agenda</h2>
          <ul className="space-y-2">
            {events.map((evt) => (
              <li key={evt.id} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-gray-500 w-12">
                  {formatTime(evt.start_datetime.split('T')[1] || '00:00')}
                </span>
                <span className="text-gray-800 dark:text-gray-200">{evt.title}</span>
                <ScopeBadge scope={evt.scope} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Blocked / pending */}
      {blocked.length > 0 && (
        <section className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <h2 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3">Pendientes de otros</h2>
          <ul className="space-y-3">
            {blocked.map((t) => (
              <li key={t.id}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.title}</p>
                <p className="text-xs text-gray-500">
                  {t.block_reason ? BLOCK_REASON_LABELS[t.block_reason as BlockReason] : ''}
                  {t.block_reason_detail && ` — ${t.block_reason_detail}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {urgent.length === 0 && important.length === 0 && events.length === 0 && blocked.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Sin actividades para hoy</p>
        </div>
      )}
    </div>
  );
}
