import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  ArrowLeftRight,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { MyRequestItem } from '../data/mock';

export type RequestModalType = 'overtime' | 'schedule-change' | 'official-business';

interface NewRequestModalProps {
  isOpen: boolean;
  initialType?: RequestModalType;
  onClose: () => void;
  onSubmitSuccess: (newRequest: MyRequestItem) => void;
}

export function NewRequestModal({
  isOpen,
  initialType = 'overtime',
  onClose,
  onSubmitSuccess,
}: NewRequestModalProps) {
  const [requestType, setRequestType] = useState<RequestModalType>(initialType);
  const [date, setDate] = useState<string>('2026-08-27');
  const [startTime, setStartTime] = useState<string>('17:00');
  const [endTime, setEndTime] = useState<string>('20:00');
  const [reason, setReason] = useState<string>('');
  const [targetShift, setTargetShift] = useState<string>('13:00 – 22:00 (Mid Shift)');
  const [destination, setDestination] = useState<string>('Client HQ / BGC Taguig');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      let title = '';
      let description = '';

      if (requestType === 'overtime') {
        title = `Overtime Request (3.0 hrs)`;
        description = `${date} • ${startTime} - ${endTime} • ${reason || 'Project Delivery Sprint'}`;
      } else if (requestType === 'schedule-change') {
        title = `Schedule Change (${targetShift.split(' ')[0]})`;
        description = `Effective ${date} • Change to ${targetShift} • ${reason || 'Personal / Travel schedule'}`;
      } else {
        title = `Official Business Pass (${destination})`;
        description = `${date} • ${destination} • ${reason || 'On-site Client Meeting'}`;
      }

      const newReq: MyRequestItem = {
        id: `REQ-${Date.now().toString().slice(-4)}`,
        type: requestType,
        title,
        description,
        date,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        approver: 'Engr. Arthur Pendelton (Tech Lead)',
      };

      setTimeout(() => {
        setShowSuccess(false);
        onSubmitSuccess(newReq);
        onClose();
      }, 1200);
    }, 600);
  };

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
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[36px] bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 safe-bottom hrms-scroll"
      >
        {/* Drag Handle */}
        <div className="sticky top-0 z-20 flex justify-center bg-white pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-slate-200" />
        </div>

        {/* Modal Header */}
        <div className="sticky top-5 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3 backdrop-blur-md">
          <div>
            <h2 className="text-[16.5px] font-black text-slate-900 leading-tight">
              File New Request
            </h2>
            <p className="text-[12px] font-bold text-slate-400">
              Submit personal employee application
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 pt-4 pb-8">
          {/* Request Type Selector Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRequestType('overtime')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-black transition ${
                requestType === 'overtime'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Overtime</span>
            </button>

            <button
              type="button"
              onClick={() => setRequestType('schedule-change')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-black transition ${
                requestType === 'schedule-change'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Shift Swap</span>
            </button>

            <button
              type="button"
              onClick={() => setRequestType('official-business')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-black transition ${
                requestType === 'official-business'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>OB Pass</span>
            </button>
          </div>

          {/* Date Picker */}
          <div>
            <label className="mb-1 block text-[12.5px] font-black uppercase tracking-wider text-slate-500">
              Application Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-[14.5px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Conditional Fields for Overtime */}
          {requestType === 'overtime' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12px] font-black uppercase tracking-wider text-slate-500">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-3 text-[14px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-black uppercase tracking-wider text-slate-500">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-3 text-[14px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields for Schedule Change */}
          {requestType === 'schedule-change' && (
            <div>
              <label className="mb-1 block text-[12.5px] font-black uppercase tracking-wider text-slate-500">
                Target Shift Schedule
              </label>
              <select
                value={targetShift}
                onChange={(e) => setTargetShift(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-[14px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white"
              >
                <option value="13:00 – 22:00 (Mid Shift)">
                  1:00 PM – 10:00 PM (Mid Shift)
                </option>
                <option value="21:00 – 06:00 (Night Shift)">
                  9:00 PM – 6:00 AM (Night Shift)
                </option>
                <option value="06:00 – 15:00 (Early Morning)">
                  6:00 AM – 3:00 PM (Early Morning)
                </option>
                <option value="Weekend Off Shift">
                  Weekend Off Shift (Compensatory)
                </option>
              </select>
            </div>
          )}

          {/* Conditional Fields for Official Business */}
          {requestType === 'official-business' && (
            <div>
              <label className="mb-1 block text-[12.5px] font-black uppercase tracking-wider text-slate-500">
                Destination / Client Site
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Client HQ / Ortigas Center"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-[14px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white"
              />
            </div>
          )}

          {/* Reason / Remarks */}
          <div>
            <label className="mb-1 block text-[12.5px] font-black uppercase tracking-wider text-slate-500">
              Reason / Justification
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the purpose of this request..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-[14px] font-bold text-slate-800 outline-none focus:border-brand-blue focus:bg-white resize-none"
            />
          </div>

          {/* Approver Tag */}
          <div className="flex items-center gap-2 rounded-2xl bg-blue-50/70 p-3 text-[12px] font-bold text-brand-blue ring-1 ring-blue-200/60">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-blue" />
            <span>
              Route to Approver: <strong>Engr. Arthur Pendelton (Tech Lead)</strong>
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue py-3.5 text-[15.5px] font-black text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-600 active:scale-95 disabled:opacity-75"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Submit Application</span>
            )}
          </button>

          {/* Success Overlay Feedback */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3 text-[13.5px] font-black text-emerald-700 ring-1 ring-emerald-200"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Request submitted successfully to approver!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
