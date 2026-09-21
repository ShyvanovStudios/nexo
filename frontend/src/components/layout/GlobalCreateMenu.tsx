import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';

const CREATE_OPTIONS = [
  { label: 'Nueva tarea', path: '/tareas/nueva', icon: '✓' },
  { label: 'Nuevo evento', path: '/agenda/nuevo', icon: '📅' },
  { label: 'Nueva nota', path: '/notas/nueva', icon: '📝' },
  { label: 'Agregar a Inbox', path: '/inbox', icon: '📥' },
];

export function GlobalCreateMenu() {
  const { globalCreateOpen, setGlobalCreateOpen } = useUIStore();
  const navigate = useNavigate();

  if (!globalCreateOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => setGlobalCreateOpen(false)}
      />

      {/* Menu */}
      <div className="absolute bottom-32 right-6 md:bottom-auto md:top-20 md:right-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden min-w-[220px] animate-in fade-in slide-in-from-bottom-4">
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Crear
          </p>
          {CREATE_OPTIONS.map((opt) => (
            <button
              key={opt.path}
              onClick={() => {
                setGlobalCreateOpen(false);
                navigate(opt.path);
              }}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[48px]"
            >
              <span className="text-lg">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
