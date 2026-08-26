import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays,
  Users,
  Bell,
  FileText,
  Fingerprint,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
  Mail,
  Briefcase,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { currentUser, profileLinks } from '../data/mock';
import { PayslipModal } from '../components/PayslipModal';
import { ScheduleModal } from '../components/ScheduleModal';
import { NewRequestModal } from '../components/NewRequestModal';

const ICON_MAP: Record<string, typeof CalendarDays> = {
  'calendar-days': CalendarDays,
  users: Users,
  bell: Bell,
  'file-text': FileText,
  fingerprint: Fingerprint,
  settings: Settings,
};

export function ProfilePage({ onLogout }: { onLogout?: () => void }) {
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isShiftSwapOpen, setIsShiftSwapOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    if (id === 'payslip') {
      setIsPayslipOpen(true);
    } else if (id === 'schedule') {
      setIsScheduleOpen(true);
    }
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4 px-4 py-4 pb-36"
    >
      {/* ── Employee Info Card ── */}
      <section className="hrms-card-accent overflow-hidden rounded-3xl border border-white bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
        <div className="flex flex-col items-center px-4 pb-5 pt-6">
          {/* Avatar with Status Ring */}
          <div className="relative mb-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4B89CD] via-[#3d7ab8] to-[#2f6fad] text-[1.65rem] font-black text-white shadow-[0_10px_26px_rgba(75,137,205,0.35)] ring-4 ring-white">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <span className="absolute bottom-0.5 right-0.5 h-4.5 w-4.5 rounded-full border-[3px] border-white bg-[#43A751] shadow-sm" />
          </div>

          <h2 className="hrms-display text-[1.65rem] font-black tracking-tight text-slate-900 leading-tight">
            {currentUser.name}
          </h2>
          <p className="mt-0.5 text-[15px] font-black text-brand-blue">
            {currentUser.position}
          </p>

          {/* Info tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3.5 py-1.5 ring-1 ring-brand-blue/15">
              <Building2 className="h-3.5 w-3.5 text-brand-blue" strokeWidth={2.4} />
              <span className="text-[12.5px] font-black text-brand-blue">
                {currentUser.department}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 ring-1 ring-slate-200/60">
              <Briefcase className="h-3.5 w-3.5 text-slate-500" strokeWidth={2.4} />
              <span className="text-[12.5px] font-black text-slate-600">
                {currentUser.id}
              </span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Mail className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <span className="text-[14px] font-bold text-slate-700">
              {currentUser.email}
            </span>
            <span className="ml-auto flex items-center gap-1 text-[12px] font-black text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              Verified
            </span>
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-brand-blue" strokeWidth={2.6} />
          <h2 className="hrms-display text-[16.5px] font-black tracking-tight text-slate-800">
            Account & Preferences
          </h2>
        </div>

        <section className="hrms-card-accent overflow-hidden rounded-3xl border border-white bg-white/95 shadow-[0_6px_18px_rgba(15,23,42,0.06)] ring-1 ring-brand-blue/10">
          <div className="divide-y divide-slate-100">
            {profileLinks.map((link) => {
              const Icon = ICON_MAP[link.icon] || FileText;
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-slate-50 hover:bg-slate-50/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10">
                    <Icon className="h-5 w-5 text-brand-blue" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-black tracking-tight text-slate-800 leading-tight">
                      {link.label}
                    </p>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                      {link.sublabel}
                    </p>
                  </div>
                  {'badge' in link && link.badge ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-2 text-[10.5px] font-black text-white shadow-sm">
                      {link.badge}
                    </span>
                  ) : null}
                  <ChevronRight className="h-4.5 w-4.5 text-slate-300" strokeWidth={2.4} />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Logout ── */}
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white/95 px-4 py-3.5 text-[15.5px] font-black text-[#EF4444] shadow-sm transition active:scale-[0.98] active:bg-red-50"
      >
        <LogOut className="h-4.5 w-4.5" strokeWidth={2.6} />
        Sign Out
      </button>

      {/* ── App Version ── */}
      <p className="text-center text-[12px] font-black uppercase tracking-wider text-slate-400">
        HRMS Mobile • v1.0.0
      </p>

      {/* ── Payslip Modal ── */}
      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
      />

      {/* ── Schedule Modal ── */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onRequestShiftChange={() => setIsShiftSwapOpen(true)}
      />

      {/* ── Shift Swap Form Modal ── */}
      <NewRequestModal
        isOpen={isShiftSwapOpen}
        initialType="schedule-change"
        onClose={() => setIsShiftSwapOpen(false)}
        onSubmitSuccess={() => {}}
      />
    </motion.div>
  );
}
