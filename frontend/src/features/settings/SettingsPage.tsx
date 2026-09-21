import { useUIStore } from '../../stores/uiStore';
import { useScopes } from '../../hooks/useScopes';
import { useTags } from '../../hooks/useTags';
import { db } from '../../services/db';

export function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const { data: scopes = [] } = useScopes();
  const { data: tags = [] } = useTags();

  const handleClearData = async () => {
    if (confirm('¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.')) {
      await db.delete();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Configuración</h1>

      {/* General */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">General</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Almacenamiento: <span className="font-medium text-gray-800 dark:text-gray-200">Local (IndexedDB)</span>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tema</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm min-h-[44px]"
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">Zona horaria: America/Santiago</div>
      </section>

      {/* Scopes */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Ámbitos</h2>
        <ul className="space-y-2">
          {scopes.map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-sm">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-gray-800 dark:text-gray-200">{s.name}</span>
              <span className="text-xs text-gray-400">{s.is_active ? 'Activo' : 'Inactivo'}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tags */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Etiquetas</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t.id} className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {t.name}
            </span>
          ))}
          {tags.length === 0 && <p className="text-xs text-gray-400">Sin etiquetas</p>}
        </div>
      </section>

      {/* Data management */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Datos</h2>
        <p className="text-xs text-gray-500">Los datos se almacenan localmente en tu dispositivo.</p>
        <button
          onClick={handleClearData}
          className="w-full py-3 rounded-lg text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 min-h-[48px]"
        >
          Borrar todos los datos
        </button>
      </section>
    </div>
  );
}
