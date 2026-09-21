import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Scope, Tag, TaskCreatePayload } from '../../types';

const taskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  scope_id: z.number({ required_error: 'El ámbito es obligatorio' }),
  description: z.string().optional(),
  importance: z.number().min(1).max(3).optional(),
  urgency: z.number().min(1).max(3).optional(),
  due_date: z.string().optional(),
  due_time: z.string().optional(),
  tag_ids: z.array(z.number()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  scopes: Scope[];
  tags: Tag[];
  onSubmit: (data: TaskCreatePayload) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
}

export function TaskForm({ scopes, tags, onSubmit, onCancel, initialData, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      importance: 2,
      urgency: 2,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as TaskCreatePayload))} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título *
        </label>
        <input
          {...register('title')}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          placeholder="¿Qué necesitas hacer?"
          autoFocus
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ámbito *
        </label>
        <select
          {...register('scope_id', { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Seleccionar ámbito</option>
          {scopes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.scope_id && (
          <p className="mt-1 text-xs text-red-500">{errors.scope_id.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 resize-none"
          placeholder="Detalles adicionales..."
        />
      </div>

      {/* Importance + Urgency row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Importancia
          </label>
          <select
            {...register('importance', { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          >
            <option value={1}>Baja</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Urgencia
          </label>
          <select
            {...register('urgency', { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          >
            <option value={1}>Baja</option>
            <option value={2}>Media</option>
            <option value={3}>Alta</option>
          </select>
        </div>
      </div>

      {/* Due date + time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha límite
          </label>
          <input
            type="date"
            {...register('due_date')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Hora límite
          </label>
          <input
            type="time"
            {...register('due_time')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px] focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Etiquetas
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[36px]"
            >
              <input
                type="checkbox"
                value={tag.id}
                {...register('tag_ids', { setValueAs: (v: string[]) => v?.map(Number) })}
                className="rounded"
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-colors min-h-[44px]"
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
