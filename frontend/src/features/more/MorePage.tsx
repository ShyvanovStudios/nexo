import { NavLink } from 'react-router-dom';

const MORE_ITEMS = [
  { to: '/mi-dia', label: 'Mi Día' },
  { to: '/historial', label: 'Historial' },
  { to: '/inbox', label: 'Bandeja de Entrada' },
  { to: '/estadisticas', label: 'Estadísticas' },
  { to: '/configuracion', label: 'Configuración' },
];

export function MorePage() {
  return (
    <div className="max-w-md mx-auto space-y-2">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Más opciones</h1>
      {MORE_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex items-center px-4 py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[48px]"
        >
          {item.label}
          <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </NavLink>
      ))}
    </div>
  );
}
