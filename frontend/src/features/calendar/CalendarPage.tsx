import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '../../services/events';
import { useTasks } from '../../hooks/useTasks';
import { useScopes } from '../../hooks/useScopes';
import { ScopeBadge } from '../../components/ui/ScopeBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';

type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd');

  const { data: events = [] } = useQuery({
    queryKey: ['events', monthStart, monthEnd],
    queryFn: () => eventsService.list({ start: monthStart, end: monthEnd }),
  });

  const { data: tasks = [] } = useTasks({ due_date_gte: monthStart, due_date_lte: monthEnd });

  const prev = () => setCurrentDate((d) => subMonths(d, 1));
  const next = () => setCurrentDate((d) => addMonths(d, 1));
  const today = () => setCurrentDate(new Date());

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Agenda</h1>
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          {(['month', 'week', 'day', 'agenda'] as CalendarViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-2 text-xs font-medium capitalize min-h-[40px] ${
                viewMode === m
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {{ month: 'Mes', week: 'Semana', day: 'Día', agenda: 'Agenda' }[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Mes anterior">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <button onClick={next} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Mes siguiente">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
        <button onClick={today} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[36px]">
          Hoy
        </button>
      </div>

      {/* Views */}
      {viewMode === 'month' && (
        <MonthView currentDate={currentDate} events={events} tasks={tasks} />
      )}
      {viewMode === 'agenda' && (
        <AgendaView events={events} tasks={tasks} />
      )}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="text-center py-16 text-gray-400">
          Vista {viewMode === 'week' ? 'semanal' : 'diaria'} — próximamente
        </div>
      )}
    </div>
  );
}

function MonthView({ currentDate, events, tasks }: { currentDate: Date; events: Event[]; tasks: import('../../types').Task[] }) {
  const monthStart = startOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { locale: es });
  const calEnd = endOfWeek(endOfMonth(currentDate), { locale: es });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayEvents = (events as any[]).filter((e: any) => e.start_datetime?.startsWith(dateStr));
          const dayTasks = tasks.filter((t) => t.due_date === dateStr);
          const inMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={dateStr}
              className={`min-h-[80px] md:min-h-[100px] p-1 border-b border-r border-gray-100 dark:border-gray-800 ${
                !inMonth ? 'bg-gray-50 dark:bg-gray-950' : ''
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 text-xs rounded-full ${
                  isToday(day)
                    ? 'bg-primary-600 text-white font-bold'
                    : inMonth
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </span>
              <div className="mt-1 space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((e: any) => (
                  <div key={e.id} className="text-[10px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 truncate">
                    {e.title}
                  </div>
                ))}
                {dayTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="text-[10px] px-1 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 truncate">
                    {t.title}
                  </div>
                ))}
                {dayEvents.length + dayTasks.length > 4 && (
                  <span className="text-[10px] text-gray-400">+{dayEvents.length + dayTasks.length - 4} más</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({ events, tasks }: { events: Event[]; tasks: import('../../types').Task[] }) {
  const allItems = [
    ...(events as any[]).map((e: any) => ({ type: 'event' as const, date: e.start_datetime, title: e.title, scope: e.scope, item: e })),
    ...tasks.filter((t) => t.due_date).map((t) => ({ type: 'task' as const, date: t.due_date!, title: t.title, scope: t.scope, item: t })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      {allItems.length === 0 ? (
        <p className="text-center py-12 text-gray-400">Sin eventos ni tareas con fecha</p>
      ) : (
        allItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
              item.type === 'event' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              {item.type === 'event' ? 'Evento' : 'Tarea'}
            </span>
            <span className="text-xs text-gray-500 font-mono w-20">
              {item.date.includes('T') ? format(parseISO(item.date), 'dd/MM HH:mm') : format(parseISO(item.date), 'dd/MM')}
            </span>
            <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
            <ScopeBadge scope={item.scope} />
          </div>
        ))
      )}
    </div>
  );
}
