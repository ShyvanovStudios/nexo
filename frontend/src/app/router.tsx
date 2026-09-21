import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MyDayPage } from '../features/myday/MyDayPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { TaskCreatePage } from '../features/tasks/TaskCreatePage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { NotesPage } from '../features/notes/NotesPage';
import { HistoryPage } from '../features/history/HistoryPage';
import { InboxPage } from '../features/inbox/InboxPage';
import { StatsPage } from '../features/stats/StatsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { MorePage } from '../features/more/MorePage';
import { authService } from '../services/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'mi-dia', element: <MyDayPage /> },
      { path: 'tareas', element: <TasksPage /> },
      { path: 'tareas/nueva', element: <TaskCreatePage /> },
      { path: 'agenda', element: <CalendarPage /> },
      { path: 'agenda/nuevo', element: <CalendarPage /> },
      { path: 'notas', element: <NotesPage /> },
      { path: 'notas/nueva', element: <NotesPage /> },
      { path: 'historial', element: <HistoryPage /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'estadisticas', element: <StatsPage /> },
      { path: 'configuracion', element: <SettingsPage /> },
      { path: 'mas', element: <MorePage /> },
    ],
  },
]);
