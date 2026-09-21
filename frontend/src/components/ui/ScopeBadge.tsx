import type { Scope } from '../../types';

interface ScopeBadgeProps {
  scope: Scope;
  size?: 'sm' | 'md';
}

export function ScopeBadge({ scope, size = 'sm' }: ScopeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        backgroundColor: `${scope.color}15`,
        color: scope.color,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: scope.color }}
      />
      {scope.name}
    </span>
  );
}
