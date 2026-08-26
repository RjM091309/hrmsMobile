import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarDays as CalIcon,
} from 'lucide-react';
import { weeklyAttendance, monthlyAttendance } from '../data/mock';

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  present: {
    bg: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Present',
  },
  absent: {
    bg: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    label: 'Absent',
  },
  late: {
    bg: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Late',
  },
  'half-day': {
    bg: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/80',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Half-day',
  },
  weekend: {
    bg: 'bg-slate-50 text-slate-400',
    text: 'text-slate-300',
    dot: 'transparent',
    label: 'Weekend',
  },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0
}

export function AttendancePage() {
  const [calMonth, setCalMonth] = useState(7); // Aug (0-indexed)
  const [calYear, setCalYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number>(26);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [clockInTime, setClockInTime] = useState<string>('08:15 AM');

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const totalPresent = weeklyAttendance.filter((r) => r.status === 'present').length;
  const totalHours = weeklyAttendance.reduce((sum, r) => sum + r.hours, 0).toFixed(1);

  const selectedStatus = monthlyAttendance[selectedDay];
  const selectedConfig = selectedStatus ? STATUS_CONFIG[selectedStatus] : null;

  const handleToggleClock = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
    } else {
      setIsClockedIn(true);
      const now = new Date();
      setClockInTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    }
  };

  return (
    <motion.div
      key="attendance"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4 px-4 py-4 pb-36"
    >
      {/* ── Unified Modern Live Work Log & Punch Card ── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isClockedIn
                  ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 shadow-sm'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isClockedIn ? (
                <LogIn className="h-6 w-6" strokeWidth={2.4} />
              ) : (
                <LogOut className="h-6 w-6" strokeWidth={2.4} />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <h3 className="text-[16px] font-black text-slate-900 leading-none">
                  {isClockedIn ? 'Timed In' : 'Not Timed In'}
                </h3>
              </div>
              <p className="mt-1 text-[13px] font-bold text-slate-500">
                {isClockedIn ? (
                  <>
                    Since <strong className="text-brand-blue">{clockInTime}</strong> today
                  </>
                ) : (
                  'Tap button to time in'
                )}
              </p>
            </div>
          </div>

          {/* Punch Button */}
          <button
            type="button"
            onClick={handleToggleClock}
            className={`rounded-2xl px-4 py-2.5 text-[14px] font-black text-white shadow-md transition active:scale-95 ${
              isClockedIn
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                : 'bg-brand-blue hover:bg-blue-600 shadow-blue-500/20'
            }`}
          >
            {isClockedIn ? 'Time Out' : 'Time In'}
          </button>
        </div>

        {/* Live Mini Timeline Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
          <div className="rounded-xl bg-slate-50 p-2.5 text-center">
            <p className="text-[11.5px] font-black uppercase tracking-wider text-slate-400">
              Shift
            </p>
            <p className="mt-0.5 text-[14px] font-black text-slate-800">
              8:00A – 5:00P
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 text-center">
            <p className="text-[11.5px] font-black uppercase tracking-wider text-slate-400">
              Break
            </p>
            <p className="mt-0.5 text-[14px] font-black text-slate-800">
              12:00P – 1:00P
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-2.5 text-center">
            <p className="text-[11.5px] font-black uppercase tracking-wider text-slate-400">
              Logged
            </p>
            <p className="mt-0.5 text-[14px] font-black text-emerald-600">
              {isClockedIn ? '6.75 hrs' : '0.00 hrs'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Weekly Summary Card ── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Current Week
            </span>
            <h3 className="text-[16.5px] font-black text-slate-900 leading-tight">
              Weekly Attendance Log
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-[12.5px] font-black text-emerald-700 ring-1 ring-emerald-200">
              {totalPresent} Days
            </span>
            <span className="rounded-xl bg-blue-50 px-2.5 py-1 text-[12.5px] font-black text-brand-blue ring-1 ring-blue-200">
              {totalHours}h Total
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 pt-1">
          {weeklyAttendance.map((record) => {
            const dateObj = new Date(record.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.getDate();
            const isFuture = dayNum > 26; // Today is 26th

            return (
              <div
                key={record.date}
                className="flex items-center justify-between py-2.5 px-1"
              >
                {/* Date Pod */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10.5 w-10.5 flex-col items-center justify-center rounded-xl font-bold text-center ${
                      dayNum === 26
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-85 leading-none">
                      {dayName}
                    </span>
                    <span className="text-[14.5px] font-black leading-none mt-0.5">
                      {dayNum}
                    </span>
                  </div>

                  <div>
                    {record.clockIn ? (
                      <p className="text-[14.5px] font-black text-slate-800 leading-tight">
                        {record.clockIn} {record.clockOut ? `— ${record.clockOut}` : '— (Ongoing)'}
                      </p>
                    ) : (
                      <p className="text-[14px] font-bold text-slate-400 leading-tight">
                        {isFuture ? 'Scheduled: 8:00 AM' : 'No attendance record'}
                      </p>
                    )}
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                      {isFuture ? 'Upcoming shift' : record.hours > 0 ? `${record.hours} hours logged` : '0 hours'}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                {isFuture ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11.5px] font-bold text-slate-500">
                    Upcoming
                  </span>
                ) : record.status === 'present' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11.5px] font-black text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Present
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11.5px] font-black text-rose-700 ring-1 ring-rose-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Absent
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Monthly Calendar View ── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        {/* Month Selector Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <CalIcon className="h-5 w-5 text-brand-blue" />
            <h3 className="text-[16px] font-black text-slate-900">
              {MONTHS[calMonth]} {calYear}
            </h3>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200 shadow-sm">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 active:scale-90 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 active:scale-90 transition"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 px-3 pt-3 text-center">
          {DAYS_SHORT.map((d) => (
            <span
              key={d}
              className="py-1 text-[11.5px] font-black uppercase tracking-wider text-slate-400"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 px-3 pt-1 pb-3">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`blank-${i}`} className="h-10" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = monthlyAttendance[day];
            const config = status ? STATUS_CONFIG[status] : null;
            const isToday = day === 26 && calMonth === 7 && calYear === 2026;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`
                  relative flex h-10 flex-col items-center justify-between rounded-xl p-1 transition-all active:scale-95
                  ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 ring-2 ring-brand-blue'
                      : config && config.bg
                      ? config.bg
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-brand-blue font-black' : ''}
                `}
              >
                <span className={`text-[13px] font-black leading-none ${isSelected ? 'text-white' : ''}`}>
                  {day}
                </span>

                {config && config.dot !== 'transparent' && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? 'bg-white' : config.dot
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Inspection Card */}
        {selectedDay && (
          <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
            <div>
              <p className="text-[13.5px] font-black text-slate-800">
                {MONTHS[calMonth]} {selectedDay}, {calYear}
              </p>
              <p className="text-[12px] font-bold text-slate-400 capitalize">
                {selectedConfig ? selectedConfig.label : 'Regular Workday'}
              </p>
            </div>

            {selectedConfig && selectedConfig.label !== 'Weekend' ? (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-black ${selectedConfig.bg}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${selectedConfig.dot}`} />
                {selectedConfig.label}
              </span>
            ) : (
              <span className="text-[12px] font-bold text-slate-400">Off-duty</span>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 bg-slate-50/50 px-3 py-2.5">
          {[
            { label: 'Present', color: 'bg-emerald-500' },
            { label: 'Absent', color: 'bg-rose-500' },
            { label: 'Late', color: 'bg-amber-500' },
            { label: 'Half-day', color: 'bg-blue-500' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-[12px] font-extrabold text-slate-600">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
