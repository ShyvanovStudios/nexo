import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { es } from 'date-fns/locale';

export const TIMEZONE = 'America/Santiago';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: es });
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm', { locale: es });
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5); // HH:mm
}

export function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  if (isThisWeek(date)) return format(date, 'EEEE', { locale: es });
  return format(date, 'dd MMM', { locale: es });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
