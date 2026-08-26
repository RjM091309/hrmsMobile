import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Megaphone,
  ShieldCheck,
  CheckCheck,
  Trash2,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'approval' | 'announcement' | 'system' | 'reminder';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'approval',
    title: 'Vacation Leave Approved',
    description: 'Your leave application for Sep 01 – Sep 03, 2026 has been approved by Engr. Arthur Pendelton.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'reminder',
    title: 'Shift Change Under Review',
    description: 'Shift Change Request #REQ-003 is currently being evaluated for coverage.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'announcement',
    title: 'Office Closed on National Heroes Day',
    description: 'Please be reminded that Monday, Aug 31 is an official public holiday. No shifts scheduled.',
    time: 'Yesterday',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Health Pass Verified',
    description: 'Your daily health declaration was verified and approved.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'approval',
    title: 'Medical Certificate Validated',
    description: 'Sick Leave #REQ-002 supporting documents validated by HR Medical Team.',
    time: 'Aug 20, 2026',
    read: true,
  },
];

const NOTIF_ICONS = {
  approval: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 ring-emerald-200' },
  reminder: { icon: Clock, color: 'text-amber-600 bg-amber-50 ring-amber-200' },
  announcement: { icon: Megaphone, color: 'text-brand-blue bg-blue-50 ring-blue-200' },
  system: { icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 ring-purple-200' },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'approvals'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'approvals') return n.type === 'approval';
    return true;
  });

  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4 px-4 py-4 pb-36"
    >
      {/* ── Top Action Row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand-blue" strokeWidth={2.4} />
          <h2 className="hrms-display text-[16px] font-black text-slate-800">
            Inbox Alerts
          </h2>
          {unreadCount > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-red-500 px-2 text-[11px] font-extrabold text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1 text-[11.5px] font-extrabold text-brand-blue hover:bg-blue-100 active:scale-95 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark Read</span>
              </button>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-200 active:scale-95 transition"
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-200/60 p-1 backdrop-blur-sm">
        {(['all', 'unread', 'approvals'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`flex-1 rounded-xl py-2.5 text-[12px] font-black uppercase tracking-wider transition-all duration-200 ${
              filter === tab
                ? 'bg-white text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                : 'text-slate-500 hover:text-slate-700 active:text-slate-900'
            }`}
          >
            {tab === 'all' ? 'All' : tab === 'unread' ? `Unread (${unreadCount})` : 'Approvals'}
          </button>
        ))}
      </div>

      {/* ── Notification Feed ── */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/70 bg-white p-12 text-center shadow-sm">
            <Bell className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.5} />
            <p className="mt-3 text-[15px] font-black text-slate-700">
              No notifications
            </p>
            <p className="mt-1 text-[13px] font-bold text-slate-400">
              You are completely caught up!
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const { icon: Icon, color } = NOTIF_ICONS[item.type] || NOTIF_ICONS.system;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative flex items-start gap-3.5 rounded-2xl border p-4 shadow-sm transition active:scale-[0.99] ${
                  item.read
                    ? 'border-slate-200/80 bg-white'
                    : 'border-blue-100 bg-blue-50/40 ring-1 ring-brand-blue/10'
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${color}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-[15.5px] leading-tight ${
                        item.read ? 'font-bold text-slate-800' : 'font-black text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                    )}
                  </div>

                  <p className="mt-1 text-[13.5px] font-bold text-slate-600 leading-snug">
                    {item.description}
                  </p>

                  <p className="mt-2 text-[12px] font-black text-slate-400">
                    {item.time}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
