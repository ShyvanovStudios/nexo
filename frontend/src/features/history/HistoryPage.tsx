import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { formatDateTime } from '../../utils/date';
import type { TaskHistory } from '../../types';

const EVENT_TYPE_LABELS: Record<string, string> = {
  TASK_CREATED: 'Tarea creada',
  TITLE_CHANGED: 'Título modificado',
  DESCRIPTION_CHANGED: 'Descripción modificada',
  STATUS_CHANGED: 'Estado modificado',
  PRIORITY_CHANGED: 'Prioridad modificada',
  SCOPE_CHANGED: 'Ámbito modificado',
  DUE_DATE_CHANGED: 'Fecha límite modificada',
  TASK_BLOCKED: 'Tarea bloqueada',
  TASK_UNBLOCKED: 'Tarea desbloqueada',
  CHECKLIST_UPDATED: 'Checklist actualizado',
  TASK_COMPLETED: 'Tarea completada',
  TASK_REOPENED: 'Tarea reabierta',
  TASK_ARCHIVED: 'Tarea archivada',
};

export function HistoryPage() {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const { data } = await api.get<TaskHistory[]>('/history/');
      return data;
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Historial</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Sin historial</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {history.map((h) => (
            <div key={h.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">
                  {formatDateTime(h.created_at)}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {EVENT_TYPE_LABELS[h.event_type] || h.event_type}
                </span>
              </div>
              {(h.previous_value || h.new_value) && (
                <p className="mt-1 text-xs text-gray-500">
                  {h.previous_value && <span className="line-through">{h.previous_value}</span>}
                  {h.previous_value && h.new_value && ' → '}
                  {h.new_value && <span className="font-medium">{h.new_value}</span>}
                </p>
              )}
              {h.comment && (
                <p className="mt-1 text-xs text-gray-500 italic">{h.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
