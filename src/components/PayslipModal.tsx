import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Download,
  Wallet,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { payslipsList, currentUser } from '../data/mock';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipModal({ isOpen, onClose }: PayslipModalProps) {
  const [selectedPayslipId, setSelectedPayslipId] = useState<string>(payslipsList[0].id);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPayslip =
    payslipsList.find((p) => p.id === selectedPayslipId) || payslipsList[0];

  const handleDownloadPdf = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  const formatPhp = (num: number) => {
    return `₱${num.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/65 backdrop-blur-md">
      {/* Click outside to close */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Modal Bottom Sheet */}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <Wallet className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[16.5px] font-black text-slate-900 leading-tight">
                Digital Payslip
              </h2>
              <p className="text-[12px] font-bold text-slate-400">
                {currentUser.name} • {currentUser.id}
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
          {/* Period Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {payslipsList.map((slip) => (
              <button
                key={slip.id}
                type="button"
                onClick={() => setSelectedPayslipId(slip.id)}
                className={`shrink-0 rounded-2xl px-3.5 py-2 text-left transition active:scale-95 ${
                  selectedPayslipId === slip.id
                    ? 'bg-brand-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-brand-blue'
                    : 'bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200/80'
                }`}
              >
                <p className="text-[12px] font-black leading-tight">
                  {slip.period}
                </p>
                <p
                  className={`text-[10.5px] font-bold mt-0.5 ${
                    selectedPayslipId === slip.id ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  Payday: {slip.payDate}
                </p>
              </button>
            ))}
          </div>

          {/* Net Take-Home Pay Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b4e85] via-[#2f6fad] to-[#4B89CD] p-5 text-white shadow-[0_12px_28px_rgba(47,111,173,0.35)]">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-black uppercase tracking-wider text-white/75">
                Net Take-Home Pay
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-black text-white backdrop-blur-md">
                <Lock className="h-3 w-3 text-emerald-300" />
                Confidential
              </span>
            </div>

            <h3 className="hrms-display mt-2 text-[2.35rem] font-black tracking-tight leading-none text-white">
              {formatPhp(currentPayslip.netPay)}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/20 pt-3">
              <div>
                <p className="text-[10.5px] font-bold text-white/70">Gross Earnings</p>
                <p className="text-[14.5px] font-black text-emerald-300">
                  {formatPhp(currentPayslip.grossPay)}
                </p>
              </div>
              <div>
                <p className="text-[10.5px] font-bold text-white/70">Total Deductions</p>
                <p className="text-[14.5px] font-black text-rose-300">
                  - {formatPhp(currentPayslip.totalDeductions)}
                </p>
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-[14.5px] font-black text-slate-900">
                💰 Earnings Breakdown
              </h4>
              <span className="text-[12px] font-black text-emerald-600">
                Total: {formatPhp(currentPayslip.grossPay)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 pt-1 text-[13px]">
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">Basic Semi-Monthly Pay</span>
                <span className="font-black text-slate-900">
                  {formatPhp(currentPayslip.earnings.basicSalary)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">Overtime Rendered (4.5h)</span>
                <span className="font-black text-slate-900">
                  {formatPhp(currentPayslip.earnings.overtimePay)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">Transportation & Meal Allowance</span>
                <span className="font-black text-slate-900">
                  {formatPhp(currentPayslip.earnings.allowances)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Breakdown */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-[14.5px] font-black text-slate-900">
                📉 Statutory & Tax Deductions
              </h4>
              <span className="text-[12px] font-black text-rose-600">
                Total: - {formatPhp(currentPayslip.totalDeductions)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 pt-1 text-[13px]">
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">Withholding Tax (BIR)</span>
                <span className="font-black text-slate-800">
                  {formatPhp(currentPayslip.deductions.withholdingTax)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">SSS Contribution</span>
                <span className="font-black text-slate-800">
                  {formatPhp(currentPayslip.deductions.sss)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">PhilHealth Contribution</span>
                <span className="font-black text-slate-800">
                  {formatPhp(currentPayslip.deductions.philHealth)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-600">Pag-IBIG / HDMF Contribution</span>
                <span className="font-black text-slate-800">
                  {formatPhp(currentPayslip.deductions.pagIbig)}
                </span>
              </div>
              {currentPayslip.deductions.lateDeductions && (
                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-slate-600">Tardiness / Undertime</span>
                  <span className="font-black text-slate-800">
                    {formatPhp(currentPayslip.deductions.lateDeductions)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* PDF Download Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-black text-white shadow-md transition active:scale-95 ${
              isDownloaded
                ? 'bg-emerald-600 shadow-emerald-500/25'
                : 'bg-brand-blue hover:bg-blue-600 shadow-blue-500/25'
            }`}
          >
            {isDownloaded ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span>PDF Downloaded to Device!</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Official PDF Payslip</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
