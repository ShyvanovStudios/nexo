import { getPriorityColor, getPriorityLabel } from '../../types';

interface PriorityBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

const COLOR_MAP = {
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  gray: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

const DOT_COLOR = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  gray: 'bg-gray-400',
};

export function PriorityBadge({ score, size = 'sm' }: PriorityBadgeProps) {
  const color = getPriorityColor(score);
  const label = getPriorityLabel(score);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${COLOR_MAP[color]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      aria-label={`Prioridad ${label}`}
    >
      <span className={`w-2 h-2 rounded-full ${DOT_COLOR[color]}`} />
      {label}
    </span>
  );
}
