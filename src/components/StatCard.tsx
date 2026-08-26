import type { LucideIcon } from 'lucide-react';

const ACCENTS = {
  blue: {
    bar: 'from-[#4B89CD] to-[#74A6DC]',
    ring: 'ring-[#4B89CD]/10',
    iconBg: 'bg-[#4B89CD]/10',
    iconColor: 'text-[#4B89CD]',
    valueColor: 'text-[#4B89CD]',
  },
  slate: {
    bar: 'from-[#334155] to-[#64748b]',
    ring: 'ring-[#334155]/10',
    iconBg: 'bg-[#334155]/10',
    iconColor: 'text-[#334155]',
    valueColor: 'text-[#334155]',
  },
  green: {
    bar: 'from-[#43A751] to-[#6bc578]',
    ring: 'ring-[#43A751]/10',
    iconBg: 'bg-[#43A751]/10',
    iconColor: 'text-[#43A751]',
    valueColor: 'text-[#43A751]',
  },
  purple: {
    bar: 'from-[#7C3AED] to-[#A78BFA]',
    ring: 'ring-[#7C3AED]/10',
    iconBg: 'bg-[#7C3AED]/10',
    iconColor: 'text-[#7C3AED]',
    valueColor: 'text-[#7C3AED]',
  },
} as const;

export type StatAccent = keyof typeof ACCENTS;

export function StatCard({
  title,
  value,
  subValue,
  accent = 'blue',
  icon: Icon,
  onClick,
}: {
  title: string;
  value: string | number;
  subValue?: string;
  accent?: StatAccent;
  icon?: LucideIcon;
  onClick?: () => void;
}) {
  const tone = ACCENTS[accent];
  const interactive = typeof onClick === 'function';

  const className =
    `hrms-card-accent relative flex flex-col overflow-hidden rounded-2xl border border-white bg-white/95 px-3.5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.06)] ring-1 ${tone.ring} ` +
    (interactive
      ? 'cursor-pointer transition-transform duration-150 active:scale-[0.97] hover:bg-white'
      : '');

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12.5px] font-black uppercase leading-none tracking-[0.06em] text-slate-400">
          {title}
        </p>
        {Icon && (
          <div
            className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl ${tone.iconBg}`}
          >
            <Icon className={`h-4.5 w-4.5 ${tone.iconColor}`} strokeWidth={2.4} />
          </div>
        )}
      </div>
      <h3 className="hrms-display mt-1 text-[2.1rem] font-extrabold leading-none tabular-nums text-slate-900">
        {value}
      </h3>
      {subValue && (
        <p className="mt-1 truncate text-[12px] font-bold leading-tight text-slate-500">
          {subValue}
        </p>
      )}
    </>
  );

  if (interactive) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return <div className={className}>{body}</div>;
}
