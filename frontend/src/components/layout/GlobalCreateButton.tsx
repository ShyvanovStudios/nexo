import { useUIStore } from '../../stores/uiStore';

export function GlobalCreateButton() {
  const setGlobalCreateOpen = useUIStore((s) => s.setGlobalCreateOpen);

  return (
    <button
      onClick={() => setGlobalCreateOpen(true)}
      className="fixed right-6 bottom-20 md:hidden z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center"
      aria-label="Crear nuevo"
    >
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  );
}
