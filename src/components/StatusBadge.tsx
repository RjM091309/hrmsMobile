const STATUS_STYLES = {
  approved: 'bg-[#43A751]/10 text-[#43A751]',
  pending: 'bg-[#F59E0B]/10 text-[#D97706]',
  rejected: 'bg-[#EF4444]/10 text-[#EF4444]',
  present: 'bg-[#43A751]/10 text-[#43A751]',
  absent: 'bg-[#EF4444]/10 text-[#EF4444]',
  late: 'bg-[#F59E0B]/10 text-[#D97706]',
  'half-day': 'bg-[#4B89CD]/10 text-[#4B89CD]',
} as const;

const STATUS_DOT = {
  approved: 'bg-[#43A751]',
  pending: 'bg-[#D97706]',
  rejected: 'bg-[#EF4444]',
  present: 'bg-[#43A751]',
  absent: 'bg-[#EF4444]',
  late: 'bg-[#D97706]',
  'half-day': 'bg-[#4B89CD]',
} as const;

export type BadgeStatus = keyof typeof STATUS_STYLES;

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-black uppercase tracking-wide leading-none ${
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-500'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${STATUS_DOT[status] || 'bg-slate-400'}`}
      />
      {status.replace('-', ' ')}
    </span>
  );
}
