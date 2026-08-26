import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string; // "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  label?: string;
  minDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePickerModal({
  isOpen,
  onClose,
  value,
  onChange,
  label = 'Select Date',
}: DatePickerModalProps) {
  const initialDate = value ? new Date(value) : new Date(2026, 7, 26);
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getTime()) ? 2026 : initialDate.getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getTime()) ? 7 : initialDate.getMonth(),
  );
  const [selectedDate, setSelectedDate] = useState(value || '2026-08-26');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(dateStr);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  const handleQuickPreset = (daysToAdd: number) => {
    const d = new Date(2026, 7, 26); // reference date
    d.setDate(d.getDate() + daysToAdd);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    setCurrentYear(y);
    setCurrentMonth(d.getMonth());
    setSelectedDate(dateStr);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <CalendarIcon className="h-4.5 w-4.5" strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="hrms-display text-[15px] font-extrabold tracking-tight text-slate-900 leading-tight">
                    {label}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date chosen'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 active:scale-90 transition"
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 py-3">
              {[
                { label: 'Today', days: 0 },
                { label: 'Tomorrow', days: 1 },
                { label: '+3 Days', days: 3 },
                { label: '+1 Week', days: 7 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleQuickPreset(p.days)}
                  className="flex-1 rounded-xl bg-slate-100 py-1.5 text-[11px] font-extrabold text-slate-600 hover:bg-brand-blue/10 hover:text-brand-blue active:scale-95 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Month & Year Switcher */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-xl bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-100 active:scale-90 transition"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
              </button>

              <span className="hrms-display text-[14px] font-extrabold tracking-tight text-slate-800">
                {MONTHS[currentMonth]} {currentYear}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                className="rounded-xl bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-100 active:scale-90 transition"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 pt-3 text-center">
              {DAYS_SHORT.map((d) => (
                <span
                  key={d}
                  className="text-[10.5px] font-extrabold uppercase text-slate-400 py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 pt-1 pb-4">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8 w-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const dayDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                const isSelected = selectedDate === dayDateStr;
                const isToday = dayDateStr === '2026-08-26';

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`
                      relative flex h-8 w-8 mx-auto items-center justify-center rounded-xl text-[12.5px] font-extrabold transition-all active:scale-90
                      ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#2f6fad] to-[#4B89CD] text-white shadow-md shadow-brand-blue/30 ring-2 ring-white'
                          : isToday
                          ? 'bg-brand-blue/15 text-brand-blue font-black'
                          : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Confirm & Cancel Footer */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-[13px] font-extrabold text-slate-600 hover:bg-slate-200 active:scale-95 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#2f6fad] to-[#4B89CD] py-3 text-[13px] font-extrabold text-white shadow-md shadow-brand-blue/25 hover:opacity-95 active:scale-95 transition"
              >
                <Check className="h-4 w-4" strokeWidth={2.4} />
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
