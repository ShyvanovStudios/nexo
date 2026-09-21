import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inboxService } from '../../services/inbox';
import { formatDateTime } from '../../utils/date';

export function InboxPage() {
  const qc = useQueryClient();
  const [input, setInput] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inbox'],
    queryFn: () => inboxService.list(),
  });

  const create = useMutation({
    mutationFn: (content: string) => inboxService.create(content),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inbox'] }); setInput(''); },
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => inboxService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const toTask = useMutation({
    mutationFn: (id: number) => inboxService.toTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const toNote = useMutation({
    mutationFn: (id: number) => inboxService.toNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const toEvent = useMutation({
    mutationFn: (id: number) => inboxService.toEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) create.mutate(input.trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Bandeja de Entrada</h1>

      {/* Quick capture */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Captura rápida... ¿qué necesitas recordar?"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm min-h-[48px] focus:ring-2 focus:ring-primary-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-6 py-3 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 min-h-[48px]"
        >
          Agregar
        </button>
      </form>

      {/* Items */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Bandeja vacía</p>
          <p className="text-xs mt-1">Captura ideas rápidas sin completar más datos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.filter((i) => !i.processed).map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{item.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(item.created_at)}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={() => toTask.mutate(item.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 min-h-[36px]">
                  → Tarea
                </button>
                <button onClick={() => toNote.mutate(item.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 min-h-[36px]">
                  → Nota
                </button>
                <button onClick={() => toEvent.mutate(item.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 min-h-[36px]">
                  → Evento
                </button>
                <button onClick={() => deleteItem.mutate(item.id)} className="ml-auto px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[36px]">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
