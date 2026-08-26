import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  ClipboardCheck,
  Bell,
  User,
} from 'lucide-react';

export type TabId =
  | 'dashboard'
  | 'attendance'
  | 'leave'
  | 'approvals'
  | 'notifications'
  | 'profile';

interface TabItem {
  id: TabId;
  label: string;
  Icon: typeof LayoutDashboard;
  badge?: number;
}

const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { id: 'attendance', label: 'Attendance', Icon: Clock },
  { id: 'leave', label: 'Leave', Icon: CalendarDays },
  { id: 'approvals', label: 'Requests', Icon: ClipboardCheck },
  { id: 'notifications', label: 'Alerts', Icon: Bell, badge: 3 },
  { id: 'profile', label: 'Profile', Icon: User },
];

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <nav className="safe-bottom shrink-0 w-full border-t border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex w-full items-stretch min-h-[74px]">
        {TABS.map(({ id, label, Icon, badge }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-2.5 transition-all duration-200 ${
                isActive
                  ? 'text-brand-blue'
                  : 'text-slate-400 hover:text-slate-600 active:text-slate-700'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top line indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-px left-1.5 right-1.5 h-[3.5px] rounded-b-full bg-brand-blue shadow-[0_2px_8px_rgba(75,137,205,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div
                className={`relative flex items-center justify-center transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.6 : 2.2} />

                {/* Red Unread Notification Badge */}
                {Boolean(badge && badge > 0) && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-black text-white shadow-sm ring-1.5 ring-white">
                    {badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[12px] leading-none tracking-tight transition-all duration-200 ${
                  isActive ? 'font-black text-brand-blue' : 'font-bold text-slate-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
