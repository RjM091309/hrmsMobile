import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface InlineCalendarProps {
  value: string;
  onChange: (dateStr: string) => void;
  label?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function InlineCalendar({
  value,
  onChange,
  label = 'Select Date',
}: InlineCalendarProps) {
  const initialDate = value ? new Date(value) : new Date(2026, 7, 26);
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getTime()) ? 2026 : initialDate.getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getTime()) ? 7 : initialDate.getMonth(),
  );

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
    onChange(dateStr);
  };

  const handleQuickPreset = (daysToAdd: number) => {
    const d = new Date(2026, 7, 26);
    d.setDate(d.getDate() + daysToAdd);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    setCurrentYear(y);
    setCurrentMonth(d.getMonth());
    onChange(dateStr);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-b from-blue-50/40 via-white to-white p-3.5 shadow-inner">
      {/* Calendar Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-brand-blue" strokeWidth={2.4} />
          <span className="text-[12px] font-extrabold text-slate-800">{label}</span>
        </div>
        <span className="text-[11px] font-bold text-brand-blue">
          {value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
        </span>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 py-2.5">
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
            className="flex-1 rounded-lg bg-white py-1 text-[10.5px] font-extrabold text-slate-600 shadow-sm hover:bg-brand-blue hover:text-white active:scale-95 transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Month Switcher */}
      <div className="flex items-center justify-between rounded-xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-slate-200/60">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 active:scale-90 transition"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>

        <span className="hrms-display text-[13px] font-extrabold text-slate-800">
          {MONTHS[currentMonth]} {currentYear}
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 active:scale-90 transition"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 pt-2 text-center">
        {DAYS_SHORT.map((d) => (
          <span key={d} className="text-[10px] font-extrabold uppercase text-slate-400 py-0.5">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-1 pb-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7 w-7" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const formattedMonth = String(currentMonth + 1).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const dayDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
          const isSelected = value === dayDateStr;
          const isToday = dayDateStr === '2026-08-26';

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelectDay(day)}
              className={`
                relative flex h-7 w-7 mx-auto items-center justify-center rounded-lg text-[11.5px] font-extrabold transition-all active:scale-90
                ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/30 ring-2 ring-white font-black'
                    : isToday
                    ? 'bg-brand-blue/15 text-brand-blue font-black'
                    : 'text-slate-700 hover:bg-white hover:shadow-sm'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
