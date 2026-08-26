import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  X,
  Palmtree,
  Send,
  Sparkles,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { leaveBalances, leaveRequests as initialLeaveRequests, type LeaveRequest } from '../data/mock';
import { StatusBadge } from '../components/StatusBadge';
import { Select2 } from '../components/Select2';
import { InlineCalendar } from '../components/InlineCalendar';

export function LeavePage({
  forceOpenForm = false,
  onResetForceOpen,
}: {
  forceOpenForm?: boolean;
  onResetForceOpen?: () => void;
}) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (forceOpenForm) {
      setShowForm(true);
      if (onResetForceOpen) onResetForceOpen();
    }
  }, [forceOpenForm, onResetForceOpen]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [requestsList, setRequestsList] = useState<LeaveRequest[]>(initialLeaveRequests);
  
  // Form fields
  const [selectedLeaveType, setSelectedLeaveType] = useState(leaveBalances[0]?.type ?? 'Vacation Leave');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-03');
  const [reason, setReason] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState<'start' | 'end' | null>(null);

  // Submission state: 'idle' | 'submitting' | 'success' | 'failed'
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'failed'>('idle');
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  const filtered =
    filter === 'all'
      ? requestsList
      : requestsList.filter((r) => r.status === filter);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleCloseForm = () => {
    setOpenDatePicker(null);
    setShowForm(false);
    setSubmitStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    // Simulate submission delay
    setTimeout(() => {
      // If reason is empty or says 'fail'/'error', trigger failed animation demo
      if (reason.trim().toLowerCase() === 'fail' || reason.trim().toLowerCase() === 'error') {
        setSubmitStatus('failed');
      } else {
        const days = calculateDays(startDate, endDate);
        const newId = `LR-00${requestsList.length + 1}`;
        const newReq: LeaveRequest = {
          id: newId,
          type: selectedLeaveType,
          startDate,
          endDate,
          days,
          reason: reason.trim() || 'Annual time off request',
          status: 'pending',
          appliedDate: new Date().toISOString().split('T')[0],
        };

        setRequestsList([newReq, ...requestsList]);
        setLastSubmittedId(newId);
        setSubmitStatus('success');
      }
    }, 800);
  };

  const handleSuccessDone = () => {
    setSubmitStatus('idle');
    setShowForm(false);
    setReason('');
    setFilter('all');
  };

  return (
    <motion.div
      key="leave"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative space-y-5 px-4 py-5"
    >
      {/* ── Leave Balance Cards ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palmtree className="h-4 w-4 text-brand-blue" strokeWidth={2.5} />
            <h2 className="hrms-display text-[15px] font-extrabold tracking-tight text-slate-800">
              Leave Balances
            </h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Year 2026</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {leaveBalances.map((lb) => (
            <div
              key={lb.type}
              className="hrms-card-accent overflow-hidden rounded-2xl border border-white/90 bg-white/95 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] ring-1 ring-brand-blue/10 active:scale-[0.98] transition-transform"
            >
              <p className="text-[12.5px] font-black uppercase tracking-[0.06em] text-slate-400">
                {lb.type}
              </p>
              <div className="mt-1.5 flex items-end justify-between gap-2">
                <div>
                  <p className="hrms-display text-[2.2rem] font-black leading-none" style={{ color: lb.color }}>
                    {lb.remaining}
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-slate-400">
                    of {lb.total} remaining
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-inner" style={{ backgroundColor: `${lb.color}18` }}>
                  <Calendar className="h-5 w-5" style={{ color: lb.color }} strokeWidth={2.2} />
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100/90">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(lb.remaining / lb.total) * 100}%`,
                    backgroundColor: lb.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-200/60 p-1 backdrop-blur-sm">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
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
            {tab === 'all' ? 'All' : tab}
          </button>
        ))}
      </div>

      {/* ── Leave Requests ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] font-black uppercase tracking-[0.08em] text-slate-500">
            My Leave Requests
          </p>
          <span className="text-[12px] font-bold text-slate-400">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/90 bg-white/95 px-4 py-12 text-center shadow-sm">
            <p className="text-[14px] font-bold text-slate-400">
              No {filter !== 'all' ? filter : ''} leave requests found
            </p>
          </div>
        ) : (
          filtered.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="hrms-card-accent overflow-hidden rounded-2xl border border-white/90 bg-white/95 p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)] ring-1 ring-brand-blue/10 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-black tracking-tight text-slate-900 leading-snug">
                      {req.type}
                    </h4>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="mt-1.5 text-[14.5px] font-black text-brand-blue">
                    {new Date(req.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {req.startDate !== req.endDate &&
                      ` — ${new Date(req.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}`}
                    <span className="ml-1.5 font-bold text-slate-400">
                      ({req.days} day{req.days > 1 ? 's' : ''})
                    </span>
                  </p>
                  <p className="mt-1 text-[13.5px] font-bold text-slate-600">
                    {req.reason}
                  </p>
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] font-black uppercase tracking-wide text-slate-400">
                Applied{' '}
                {new Date(req.appliedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* ── Native Mobile Bottom Sheet Overlay ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-[32px] bg-[#f8fafc] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/50"
            >
              {/* Native Grab Handle */}
              <div className="flex w-full justify-center pt-3 pb-1">
                <div className="h-1.5 w-12 rounded-full bg-slate-300" />
              </div>

              {/* Header */}
              <header className="flex items-center justify-between border-b border-slate-200/80 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-blue" />
                  <h2 className="hrms-display text-[1.25rem] font-extrabold tracking-tight text-slate-900">
                    File New Leave
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-90"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" strokeWidth={2.4} />
                </button>
              </header>

              {/* ── Content Switcher (Form / Success / Failed) ── */}
              <div className="flex-1 overflow-y-auto px-6 py-5 hrms-scroll">
                {/* ── 1. SUCCESS ANIMATION VIEW ── */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    {/* Animated Pulsing Check Icon */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                        className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.45)] ring-8 ring-emerald-50"
                      >
                        <CheckCircle2 className="h-10 w-10" strokeWidth={2.8} />
                      </motion.div>
                      <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="hrms-display text-[1.45rem] font-extrabold tracking-tight text-slate-900">
                        Leave Request Filed!
                      </h3>
                      <p className="mt-1.5 text-[13.5px] font-medium text-slate-500 max-w-xs mx-auto">
                        Your request has been successfully submitted and forwarded to your manager for approval.
                      </p>
                    </motion.div>

                    {/* Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                          Request Reference
                        </span>
                        <span className="rounded-lg bg-brand-blue/10 px-2 py-0.5 text-[11px] font-extrabold text-brand-blue">
                          {lastSubmittedId || 'LR-NEW'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-slate-500">Leave Type</span>
                        <span className="text-[13px] font-extrabold text-slate-800">{selectedLeaveType}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-slate-500">Duration</span>
                        <span className="text-[13px] font-extrabold text-brand-blue">
                          {formatDateDisplay(startDate)} — {formatDateDisplay(endDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-slate-500">Status</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-600 ring-1 ring-amber-200/80">
                          <Clock className="h-3 w-3" />
                          Pending Review
                        </span>
                      </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleSuccessDone}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2f6fad] to-[#4B89CD] py-4 text-[15px] font-extrabold text-white shadow-[0_8px_24px_rgba(75,137,205,0.35)] active:opacity-95"
                    >
                      <span>Done / View Requests</span>
                      <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
                    </motion.button>
                  </motion.div>
                )}

                {/* ── 2. FAILED ANIMATION VIEW ── */}
                {submitStatus === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -10, 10, -8, 8, -4, 4, 0] }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    {/* Animated Warning Icon */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-[0_10px_30px_rgba(244,63,94,0.4)] ring-8 ring-rose-50">
                        <AlertCircle className="h-10 w-10" strokeWidth={2.8} />
                      </div>
                    </div>

                    <h3 className="hrms-display text-[1.45rem] font-extrabold tracking-tight text-slate-900">
                      Submission Failed
                    </h3>
                    <p className="mt-1.5 text-[13.5px] font-medium text-slate-500 max-w-xs mx-auto">
                      Unable to process your leave request at this time. Please check your available balance or network connection.
                    </p>

                    {/* Retry Button */}
                    <div className="mt-6 flex w-full gap-3">
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="flex-1 rounded-2xl bg-slate-100 py-3.5 text-[14px] font-extrabold text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmitStatus('idle')}
                        className="flex-1 rounded-2xl bg-rose-600 py-3.5 text-[14px] font-extrabold text-white shadow-md shadow-rose-200 hover:bg-rose-700 active:scale-95 transition"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── 3. STANDARD FORM VIEW ── */}
                {(submitStatus === 'idle' || submitStatus === 'submitting') && (
                  <form onSubmit={handleSubmit} className="space-y-4.5">
                    {/* Leave Type */}
                    <div>
                      <label className="mb-2 block text-[11.5px] font-extrabold uppercase tracking-wider text-slate-500">
                        Leave Type
                      </label>
                      <Select2
                        options={leaveBalances.map((lb) => ({
                          value: lb.type,
                          label: lb.type,
                          color: lb.color,
                        }))}
                        value={selectedLeaveType}
                        onChange={setSelectedLeaveType}
                        placeholder="Select leave type..."
                        searchable={true}
                      />
                    </div>

                    {/* Date Range Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-[11.5px] font-extrabold uppercase tracking-wider text-slate-500">
                          Start Date
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDatePicker(openDatePicker === 'start' ? null : 'start')
                          }
                          className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-3.5 py-3.5 text-left text-[13.5px] font-extrabold shadow-sm outline-none transition active:scale-[0.98] ${
                            openDatePicker === 'start'
                              ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/40 text-brand-blue'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{formatDateDisplay(startDate)}</span>
                          <CalendarDays className="h-4.5 w-4.5 text-brand-blue shrink-0" strokeWidth={2.2} />
                        </button>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11.5px] font-extrabold uppercase tracking-wider text-slate-500">
                          End Date
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDatePicker(openDatePicker === 'end' ? null : 'end')
                          }
                          className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-3.5 py-3.5 text-left text-[13.5px] font-extrabold shadow-sm outline-none transition active:scale-[0.98] ${
                            openDatePicker === 'end'
                              ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/40 text-brand-blue'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{formatDateDisplay(endDate)}</span>
                          <CalendarDays className="h-4.5 w-4.5 text-brand-blue shrink-0" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>

                    {/* Inline Collapsible Calendar */}
                    <AnimatePresence>
                      {openDatePicker && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          <InlineCalendar
                            value={openDatePicker === 'start' ? startDate : endDate}
                            onChange={(d) => {
                              if (openDatePicker === 'start') {
                                setStartDate(d);
                              } else {
                                setEndDate(d);
                              }
                              setOpenDatePicker(null);
                            }}
                            label={openDatePicker === 'start' ? 'Select Start Date' : 'Select End Date'}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Reason */}
                    <div>
                      <label className="mb-2 block text-[11.5px] font-extrabold uppercase tracking-wider text-slate-500">
                        Reason / Notes
                      </label>
                      <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for leave (type 'fail' to test error)..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[14px] font-semibold text-slate-700 shadow-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 resize-none"
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="pt-2 pb-6">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitStatus === 'submitting'}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2f6fad] to-[#4B89CD] py-4 text-[15px] font-extrabold text-white shadow-[0_8px_24px_rgba(75,137,205,0.4)] transition active:opacity-95 disabled:opacity-80"
                      >
                        {submitStatus === 'submitting' ? (
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Processing Request...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="h-4.5 w-4.5" strokeWidth={2.4} />
                            <span>Submit Leave Request</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
