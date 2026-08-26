import { motion } from 'motion/react';
import {
  X,
  CalendarDays,
  ArrowLeftRight,
} from 'lucide-react';
import { myWeeklySchedule, upcomingHolidays } from '../data/mock';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestShiftChange: () => void;
}

export function ScheduleModal({
  isOpen,
  onClose,
  onRequestShiftChange,
}: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/65 backdrop-blur-md">
      {/* Backdrop click */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Sheet Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[36px] bg-slate-50 text-slate-900 shadow-2xl ring-1 ring-slate-200 safe-bottom hrms-scroll"
      >
        {/* Drag Handle */}
        <div className="sticky top-0 z-20 flex justify-center bg-slate-50 pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Modal Header */}
        <div className="sticky top-5 z-20 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/95 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue ring-1 ring-blue-200">
              <CalendarDays className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[16.5px] font-black text-slate-900 leading-tight">
                My Work Schedule
              </h2>
              <p className="text-[12px] font-bold text-slate-400">
                Weekly Shift Planner & Holidays
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition hover:bg-slate-300 active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="space-y-4 px-5 pt-4 pb-8">
          {/* Current Weekly Shift Table */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-[14.5px] font-black text-slate-900">
                🗓️ Weekly Shift Timetable
              </h3>
              <span className="text-[11.5px] font-black text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full ring-1 ring-blue-200">
                40 hrs / Week
              </span>
            </div>

            <div className="divide-y divide-slate-100 pt-1">
              {myWeeklySchedule.map((item) => (
                <div
                  key={item.day}
                  className={`flex items-center justify-between py-2.5 px-1 rounded-xl transition ${
                    item.isToday ? 'bg-blue-50/60 ring-1 ring-brand-blue/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 flex-col items-center justify-center rounded-xl text-center font-bold ${
                        item.isToday
                          ? 'bg-brand-blue text-white shadow-sm'
                          : item.isRestDay
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider opacity-85 leading-none">
                        {item.day}
                      </span>
                      <span className="text-[13px] font-black leading-none mt-0.5">
                        {item.dayNumber}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`text-[13.5px] font-black leading-tight ${
                          item.isRestDay ? 'text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.shift}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {item.isToday
                          ? '⭐️ Today • Core Shift'
                          : item.isRestDay
                          ? 'Weekend Rest Day'
                          : 'Regular Business Shift'}
                      </p>
                    </div>
                  </div>

                  {item.isRestDay ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-700 ring-1 ring-amber-200">
                      Rest Day
                    </span>
                  ) : item.isToday ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                      Scheduled
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Company Holidays */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h3 className="text-[14.5px] font-black text-slate-900 border-b border-slate-100 pb-2.5">
              🇵🇭 Official Philippine Holidays
            </h3>

            <div className="divide-y divide-slate-100 pt-1">
              {upcomingHolidays.map((hol) => (
                <div
                  key={hol.name}
                  className="flex items-center justify-between py-2.5 px-1"
                >
                  <div>
                    <p className="text-[13.5px] font-black text-slate-800 leading-tight">
                      {hol.name}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {hol.date}
                    </p>
                  </div>

                  <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-black text-rose-700 ring-1 ring-rose-200">
                    {hol.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Request Shift Swap Action Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestShiftChange();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue py-3.5 text-[15px] font-black text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-600 active:scale-95"
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span>Request Shift Change / Swap</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
