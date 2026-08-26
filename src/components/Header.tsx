import { Bell } from 'lucide-react';
import { currentUser } from '../data/mock';

export function Header({
  title,
  subtitle,
  showGreeting = false,
  onNotificationsClick,
  unreadCount = 0,
}: {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
  onNotificationsClick?: () => void;
  unreadCount?: number;
}) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="hrms-header relative z-40 shrink-0 overflow-hidden text-white">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/8" />
        <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-white/5" />
        <div className="absolute right-16 bottom-2 h-16 w-16 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 px-5 pb-4.5 pt-4.5">
        {showGreeting ? (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.2em] text-white/70">
                {greeting}
              </p>
              <h1 className="hrms-display mt-0.5 text-[2.05rem] font-black leading-tight tracking-tight text-white">
                {currentUser.name.split(' ')[0]}
              </h1>
              <p className="mt-1 text-[14px] font-bold text-white/80">
                {dateStr}
              </p>
            </div>

            {/* Top Right Notifications Button */}
            {onNotificationsClick && (
              <button
                type="button"
                onClick={onNotificationsClick}
                className="relative inline-flex items-center justify-center rounded-2xl bg-white/15 p-2.5 text-white/90 backdrop-blur-md transition active:scale-95 hover:bg-white/25 hover:text-white ring-1 ring-white/20 shadow-sm"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5.5 w-5.5" strokeWidth={2.4} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-black text-white shadow-sm ring-2 ring-white/40">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="hrms-display text-[1.55rem] font-black tracking-tight text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[14px] font-bold text-white/75">{subtitle}</p>
              )}
            </div>

            {/* Top Right Notifications Button on Inner Pages */}
            {onNotificationsClick && (
              <button
                type="button"
                onClick={onNotificationsClick}
                className="relative inline-flex items-center justify-center rounded-2xl bg-white/15 p-2.5 text-white/90 backdrop-blur-md transition active:scale-95 hover:bg-white/25 hover:text-white ring-1 ring-white/20 shadow-sm"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5.5 w-5.5" strokeWidth={2.4} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-black text-white shadow-sm ring-2 ring-white/40">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
