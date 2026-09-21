import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useUIStore } from '../stores/uiStore';
import { seedIfEmpty } from '../services/db';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function ThemeSync({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}

function DbInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedIfEmpty().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-600">NEXO</h1>
          <p className="text-sm text-gray-400 mt-2">Iniciando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync>
        <DbInit>{children}</DbInit>
      </ThemeSync>
    </QueryClientProvider>
  );
}
