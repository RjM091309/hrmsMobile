import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Clock,
  Briefcase,
  ArrowLeftRight,
  X,
  Plus,
  FileCheck,
} from 'lucide-react';
import { myPersonalRequests, type MyRequestItem } from '../data/mock';
import { NewRequestModal } from '../components/NewRequestModal';

const TYPE_ICONS: Record<MyRequestItem['type'], typeof CalendarDays> = {
  leave: CalendarDays,
  'schedule-change': ArrowLeftRight,
  overtime: Clock,
  'official-business': Briefcase,
};

export function ApprovalsPage() {
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requests, setRequests] = useState<MyRequestItem[]>(myPersonalRequests);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filtered =
    tab === 'all' ? requests : requests.filter((r) => r.status === tab);

  const handleCancel = (id: string, title: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setCancelNotice(`Cancelled: ${title}`);
    setTimeout(() => setCancelNotice(null), 3000);
  };

  const handleNewRequestSuccess = (newReq: MyRequestItem) => {
    setRequests((prev) => [newReq, ...prev]);
    setCancelNotice(`Submitted: ${newReq.title}`);
    setTimeout(() => setCancelNotice(null), 3000);
  };

  return (
    <motion.div
      key="approvals"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 px-4 py-4 pb-36"
    >
      {/* ── Top Header Bar with File New Request Button ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-black text-slate-900 leading-tight">
            My Applications
          </h2>
          <p className="text-[12px] font-bold text-slate-400">
            {requests.length} total requests filed
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-blue px-3.5 py-2 text-[13px] font-black text-white shadow-md shadow-blue-500/20 transition active:scale-95 hover:bg-blue-600"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.6} />
          <span>File Request</span>
        </button>
      </div>

      {/* ── Filter Tabs (Exact Match to Leave Page) ── */}
      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-200/60 p-1 backdrop-blur-sm">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-[12px] font-black uppercase tracking-wider transition-all duration-200 ${
              tab === t
                ? 'bg-white text-brand-blue shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                : 'text-slate-500 hover:text-slate-700 active:text-slate-900'
            }`}
          >
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      {/* ── Notice Alert ── */}
      <AnimatePresence>
        {cancelNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-2.5 text-white text-[13px] font-bold shadow-lg"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>{cancelNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setCancelNotice(null)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clean Minimalist Request Cards ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-sm">
            <p className="text-[14px] font-bold text-slate-400">
              No {tab !== 'all' ? tab : ''} requests found
            </p>
          </div>
        ) : (
          filtered.map((req) => {
            const Icon = TYPE_ICONS[req.type] || CalendarDays;
            const isApproved = req.status === 'approved';
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm"
              >
                {/* Top Row: Icon + Title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-black text-slate-900 leading-tight">
                        {req.title}
                      </h3>
                      <p className="mt-1 text-[13.5px] font-bold text-slate-600 leading-snug">
                        {req.description}
                      </p>
                    </div>
                  </div>

                  {/* Clean Minimalist Status Pill */}
                  <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/70 px-3 py-1 text-[12px] font-black text-slate-700">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isApproved
                          ? 'bg-emerald-500'
                          : isPending
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="capitalize">{req.status}</span>
                  </div>
                </div>

                {/* Approver & Submission Line */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[12.5px] text-slate-500">
                  <span>
                    Approver: <strong className="text-slate-800 font-black">{req.approver}</strong>
                  </span>
                  <span className="font-bold">
                    {new Date(req.submittedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Optional Remarks */}
                {req.remarks && (
                  <p className="mt-2 rounded-2xl bg-slate-50 p-2.5 text-[12.5px] text-slate-700 border border-slate-100">
                    <strong className="text-slate-900 font-black">Note:</strong> {req.remarks}
                  </p>
                )}

                {/* Cancel Button (if Pending) */}
                {isPending && (
                  <div className="mt-3.5 flex justify-end border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleCancel(req.id, req.title)}
                      className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-[13.5px] font-black text-rose-600 shadow-sm transition hover:bg-rose-100 active:scale-95"
                    >
                      <X className="h-4 w-4" strokeWidth={2.6} />
                      <span>Cancel Request</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── New Request Filing Modal ── */}
      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleNewRequestSuccess}
      />
    </motion.div>
  );
}
