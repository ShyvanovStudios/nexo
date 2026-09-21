import { useState } from 'react';
import { BlockReason, BLOCK_REASON_LABELS } from '../../types';
import type { BlockTaskPayload } from '../../types';

interface BlockTaskModalProps {
  open: boolean;
  onConfirm: (payload: BlockTaskPayload) => void;
  onCancel: () => void;
}

export function BlockTaskModal({ open, onConfirm, onCancel }: BlockTaskModalProps) {
  const [reason, setReason] = useState<BlockReason>(BlockReason.WAITING_RESPONSE);
  const [detail, setDetail] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    onConfirm({
      block_reason: reason,
      block_reason_detail: detail || undefined,
    });
    setReason(BlockReason.WAITING_RESPONSE);
    setDetail('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Bloquear tarea
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Indica el motivo del bloqueo
        </p>

        {/* Reason select */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Motivo *
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as BlockReason)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(BLOCK_REASON_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Detail */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observación
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Detalle adicional..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors min-h-[44px]"
          >
            Bloquear
          </button>
        </div>
      </div>
    </div>
  );
}
