import { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserCheck,
  Palmtree,
  Clock,
  CalendarDays,
  ArrowLeftRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CalendarCheck,
  Zap,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '../components/StatCard';
import {
  currentUser,
  myEmployeeStats,
  myPersonalRequests,
} from '../data/mock';

const REQUEST_ICONS: Record<string, typeof CalendarDays> = {
  leave: CalendarDays,
  'schedule-change': ArrowLeftRight,
  overtime: Clock,
  'official-business': CalendarDays,
};

export function DashboardPage() {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  const approvedCount = myPersonalRequests.filter((r) => r.status === 'approved').length;
  const pendingCount = myPersonalRequests.filter((r) => r.status === 'pending').length;
  const rejectedCount = myPersonalRequests.filter((r) => r.status === 'rejected').length;
  const totalCount = myPersonalRequests.length;

  const requestDonutData = [
    { name: 'Approved', value: approvedCount, color: '#43A751' },
    { name: 'Pending', value: pendingCount, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedCount, color: '#EF4444' },
  ];

  const filteredRequests =
    filter === 'all'
      ? myPersonalRequests
      : myPersonalRequests.filter((r) => r.status === filter);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4 px-4 py-4"
    >
      {/* ── My Personal Overview (1:1 Employee Metrics) ── */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-brand-blue" strokeWidth={2.6} />
            <h2 className="hrms-display text-[16.5px] font-black tracking-tight text-slate-800">
              My Monthly Summary
            </h2>
          </div>
          <span className="text-[12.5px] font-bold text-slate-400">
            August 2026
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            title="Days Present"
            value={myEmployeeStats.daysPresent}
            subValue={`${myEmployeeStats.attendanceRate} Attendance Rate`}
            accent="green"
            icon={CalendarCheck}
          />
          <StatCard
            title="Leave Credits"
            value={myEmployeeStats.leaveCreditsRemaining}
            subValue="Remaining across all types"
            accent="blue"
            icon={Palmtree}
          />
          <StatCard
            title="Overtime Hours"
            value={`${myEmployeeStats.overtimeHours} hrs`}
            subValue="Rendered this month"
            accent="purple"
            icon={Clock}
          />
          <StatCard
            title="Late / Absent"
            value={`${myEmployeeStats.daysLate + myEmployeeStats.daysAbsent} days`}
            subValue={`${myEmployeeStats.daysLate} Late • ${myEmployeeStats.daysAbsent} Absent`}
            accent="slate"
            icon={Clock3}
          />
        </div>
      </div>

      {/* ── My Today's Shift & Live Clock In Widget ── */}
      <section className="hrms-card-accent overflow-hidden rounded-3xl border border-white/90 bg-white/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <Zap className="h-4.5 w-4.5" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-slate-900 leading-tight">
                Today's Work Log
              </h3>
              <p className="text-[12px] font-bold text-slate-400">
                {currentUser.name} • {currentUser.position}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-black text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Timed In</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {/* Shift Schedule Box */}
          <div className="rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-100">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Shift Schedule
            </p>
            <p className="mt-0.5 text-[14.5px] font-black text-slate-800">
              {myEmployeeStats.shiftSchedule}
            </p>
            <p className="mt-0.5 text-[12px] font-bold text-brand-blue">
              Time In: {myEmployeeStats.todayClockIn}
            </p>
          </div>

          {/* Health Declaration Box */}
          <div className="rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-100">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Health Pass
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[14px] font-black text-emerald-700">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              <span className="truncate">Cleared</span>
            </div>
            <p className="mt-0.5 text-[11.5px] font-bold text-slate-400 truncate">
              Daily Self-Declaration
            </p>
          </div>
        </div>
      </section>

      {/* ── My Requests Activity Hub (Juan's Personal Applications) ── */}
      <section className="hrms-card-accent overflow-hidden rounded-3xl border border-white/90 bg-white/95 shadow-[0_12px_32px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Sparkles className="h-4.5 w-4.5" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="hrms-display text-[1.3rem] font-black tracking-tight text-slate-900 leading-tight">
                My Requests Status
              </h3>
              <p className="text-[12px] font-bold text-slate-400">
                Track your personal applications
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-slate-100 px-3 py-1 text-[12px] font-black tabular-nums text-slate-600">
            {totalCount} Total
          </span>
        </div>

        {/* Interactive Radial Gauge & Stats Pod */}
        <div className="grid grid-cols-5 items-center gap-3 p-4 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/20 border-b border-slate-100">
          {/* Donut Dial (2 cols) */}
          <div className="relative col-span-2 flex items-center justify-center h-28">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <PieChart>
                <Pie
                  data={requestDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={44}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {requestDonutData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="hrms-display text-[1.6rem] font-black leading-none text-slate-900">
                {totalCount}
              </span>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">
                Requests
              </span>
            </div>
          </div>

          {/* 3 Clickable Status Pills (3 cols) */}
          <div className="col-span-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 transition active:scale-95 ${
                filter === 'approved'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 ring-1 ring-emerald-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${filter === 'approved' ? 'bg-white' : 'bg-emerald-500'}`} />
                <span className="text-[12px] font-black uppercase tracking-wide">Approved</span>
              </div>
              <span className="hrms-display text-[15px] font-black tabular-nums">{approvedCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 transition active:scale-95 ${
                filter === 'pending'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100/80 ring-1 ring-amber-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${filter === 'pending' ? 'bg-white' : 'bg-amber-500'}`} />
                <span className="text-[12px] font-black uppercase tracking-wide">Pending</span>
              </div>
              <span className="hrms-display text-[15px] font-black tabular-nums">{pendingCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter(filter === 'rejected' ? 'all' : 'rejected')}
              className={`flex items-center justify-between rounded-xl px-3 py-1.5 transition active:scale-95 ${
                filter === 'rejected'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100/80 ring-1 ring-rose-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${filter === 'rejected' ? 'bg-white' : 'bg-rose-500'}`} />
                <span className="text-[12px] font-black uppercase tracking-wide">Rejected</span>
              </div>
              <span className="hrms-display text-[15px] font-black tabular-nums">{rejectedCount}</span>
            </button>
          </div>
        </div>

        {/* Live Requests Activity Stream */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[12px] font-black uppercase tracking-wider text-slate-400">
              {filter === 'all' ? 'My Applications Stream' : `Filtered: ${filter}`}
            </span>
            {filter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="text-[12px] font-black text-brand-blue hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100/80">
            {filteredRequests.map((req) => {
              const Icon = REQUEST_ICONS[req.type] || CalendarDays;
              const isApproved = req.status === 'approved';
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className="py-3 px-1 transition active:bg-slate-50 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                            : isPending
                            ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'
                            : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.4} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-black text-slate-900 leading-snug">
                          {req.title}
                        </p>
                        <p className="mt-0.5 text-[12.5px] font-bold text-slate-600 leading-snug">
                          {req.description}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-slate-400">
                          Submitted: {req.submittedDate} • Approver: {req.approver}
                        </p>
                        {req.remarks && (
                          <p className="mt-1 text-[11.5px] font-medium text-slate-700 bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-100">
                            💬 <span className="font-bold">Note:</span> {req.remarks}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ring-1 ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : isPending
                          ? 'bg-amber-50 text-amber-700 ring-amber-200'
                          : 'bg-rose-50 text-rose-700 ring-rose-200'
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : isPending ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {req.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
