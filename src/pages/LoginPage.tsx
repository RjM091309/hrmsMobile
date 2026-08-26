import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { currentUser } from '../data/mock';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [emailOrId, setEmailOrId] = useState(currentUser.email);
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  // Character interactive state
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [eyePosition, setEyePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Track email input length to move eyes dynamically
  useEffect(() => {
    if (focusedField === 'email') {
      const charCount = emailOrId.length;
      const xOffset = Math.min(Math.max((charCount - 15) * 0.4, -6), 6);
      setEyePosition({ x: xOffset, y: 3.5 });
    } else if (focusedField === 'password') {
      setEyePosition({ x: 0, y: 0 });
    } else {
      setEyePosition({ x: 0, y: 0 });
    }
  }, [emailOrId, focusedField]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (focusedField !== 'password') {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
      }
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, [focusedField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(1);

    setTimeout(() => {
      setLoadingStep(2);
    }, 600);

    setTimeout(() => {
      setLoadingStep(3);
    }, 1100);

    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1600);
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    setLoadingStep(2);

    setTimeout(() => {
      setLoadingStep(3);
    }, 500);

    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1100);
  };

  const isHandsCovering = focusedField === 'password' && !showPassword;
  const isPeeking = focusedField === 'password' && showPassword;

  return (
    <div className="relative min-h-screen min-h-dvh w-full flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#143f6d] via-[#1c5087] to-[#123357] text-white select-none hrms-scroll">
      {/* ── Background Mesh & Glowing Orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#4B89CD]/35 blur-[70px]" />
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-[#74A6DC]/25 blur-[90px]" />
      </div>

      {/* ── Top Header & Branding ── */}
      <div className="relative z-10 px-6 pt-7 pb-2">
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-xl ring-1 ring-white/20">
            <Building2 className="h-4 w-4 text-[#74A6DC]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-white/90">
              Company Portal
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-bold text-white/80">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Secure 256-bit</span>
          </div>
        </motion.div>

        {/* Title */}
        <div className="mt-3">
          <h1 className="hrms-display text-[1.85rem] font-black tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-white via-[#b8d7fa] to-white bg-clip-text text-transparent">HRMS</span>
          </h1>
          <p className="text-[13px] font-bold text-white/75">
            Self-service portal for attendance & leaves.
          </p>
        </div>
      </div>

      {/* ── Interactive Avatar Character (Inspired by Sarvesh Harmalkar Dribbble) ── */}
      <div className="relative z-20 flex justify-center -mb-16 pointer-events-none">
        <div className="relative h-56 w-56">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          >
            {/* Soft Shadow below avatar */}
            <ellipse cx="60" cy="116" rx="36" ry="4.5" fill="rgba(0,0,0,0.2)" />

            {/* Corporate Shirt Body & Collar */}
            <path
              d="M 28 96 Q 60 90 92 96 L 96 114 Q 60 118 24 114 Z"
              fill="#1E40AF"
            />
            {/* White Collar & Necktie */}
            <polygon points="60,94 52,104 68,104" fill="white" />
            <polygon points="57,104 63,104 61.5,116 58.5,116" fill="#3B82F6" />

            {/* Neck */}
            <rect x="52" y="82" width="16" height="15" rx="4" fill="#FDBA74" />

            {/* Ears */}
            <circle cx="23" cy="58" r="9" fill="#FDBA74" stroke="#FB923C" strokeWidth="1" />
            <circle cx="23" cy="58" r="5" fill="#FED7AA" />
            <circle cx="97" cy="58" r="9" fill="#FDBA74" stroke="#FB923C" strokeWidth="1" />
            <circle cx="97" cy="58" r="5" fill="#FED7AA" />

            {/* Employee Face (Head) */}
            <rect
              x="25"
              y="26"
              width="70"
              height="64"
              rx="32"
              fill="url(#skinGrad)"
              stroke="#FDBA74"
              strokeWidth="1.5"
            />

            {/* Cheeks Blush */}
            <circle cx="35" cy="68" r="6" fill="#F43F5E" opacity="0.25" />
            <circle cx="85" cy="68" r="6" fill="#F43F5E" opacity="0.25" />

            {/* Stylish Modern Dark Hair (Top & Side Sweep) */}
            <path
              d="M 24 45 C 24 24, 42 16, 62 16 C 82 16, 96 24, 96 45 C 96 32, 88 23, 76 22 C 60 21, 52 28, 40 28 C 30 28, 24 36, 24 45 Z"
              fill="#0F172A"
            />
            <path
              d="M 23 42 C 23 30, 36 22, 54 22 C 40 25, 30 32, 28 44 Z"
              fill="#1E293B"
            />
            {/* Hair highlight */}
            <path
              d="M 45 20 Q 60 17 74 21"
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Eyebrows (Expressive & Animated) */}
            <path
              d={
                focusedField === 'password'
                  ? 'M 35 44 Q 44 40 51 44'
                  : 'M 36 45 Q 44 41 51 46'
              }
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              d={
                focusedField === 'password'
                  ? 'M 69 44 Q 76 40 85 44'
                  : 'M 69 46 Q 76 41 84 45'
              }
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* Smart Glasses Frame */}
            <rect
              x="32"
              y="47"
              width="24"
              height="20"
              rx="9"
              fill="rgba(255,255,255,0.7)"
              stroke="#1E293B"
              strokeWidth="2.2"
            />
            <rect
              x="64"
              y="47"
              width="24"
              height="20"
              rx="9"
              fill="rgba(255,255,255,0.7)"
              stroke="#1E293B"
              strokeWidth="2.2"
            />
            {/* Glasses Bridge */}
            <path
              d="M 56 54 Q 60 52 64 54"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2.2"
            />

            {/* Eyes Inside Glasses (With Light Glare) */}
            {!isBlinking && (
              <>
                {/* Pupils with dynamic gaze tracking */}
                <circle
                  cx={44 + eyePosition.x}
                  cy={57 + eyePosition.y}
                  r="5.5"
                  fill="#0F172A"
                  className="transition-all duration-150"
                />
                <circle
                  cx={42 + eyePosition.x}
                  cy={55 + eyePosition.y}
                  r="2"
                  fill="white"
                  className="transition-all duration-150"
                />

                <circle
                  cx={76 + eyePosition.x}
                  cy={57 + eyePosition.y}
                  r="5.5"
                  fill="#0F172A"
                  className="transition-all duration-150"
                />
                <circle
                  cx={74 + eyePosition.x}
                  cy={55 + eyePosition.y}
                  r="2"
                  fill="white"
                  className="transition-all duration-150"
                />

                {/* Glass Glare */}
                <path
                  d="M 36 50 L 48 62"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M 68 50 L 80 62"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </>
            )}

            {/* Blinking State */}
            {isBlinking && (
              <>
                <path
                  d="M 37 57 Q 44 61 51 57"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 69 57 Q 76 61 83 57"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Nose */}
            <path
              d="M 59 62 Q 62 67 58 68"
              fill="none"
              stroke="#EA580C"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Friendly Smile */}
            <path
              d={
                isLoading
                  ? 'M 53 74 Q 60 82 67 74'
                  : focusedField === 'password'
                    ? 'M 54 75 Q 60 72 66 75'
                    : 'M 53 74 Q 60 79 67 74'
              }
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* ── Animated Employee Hands Covering Eyes on Password ── */}
            {/* Left Hand with Shirt Sleeve */}
            <motion.g
              initial={false}
              animate={{
                y: isHandsCovering ? 0 : isPeeking ? 15 : 55,
                opacity: isHandsCovering || isPeeking ? 1 : 0,
                scale: isHandsCovering ? 1 : isPeeking ? 0.95 : 0.6,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              style={{ transformOrigin: '44px 58px' }}
            >
              {/* Sleeve */}
              <rect x="25" y="58" width="36" height="14" rx="4" fill="#1E40AF" stroke="#1D4ED8" strokeWidth="1" />
              {/* Palm / Hand */}
              <rect
                x="26"
                y="43"
                width="34"
                height="22"
                rx="10"
                fill="#FDBA74"
                stroke="#FB923C"
                strokeWidth="1.5"
              />
              {/* Fingers detail */}
              <path d="M 33 43 L 33 50 M 41 43 L 41 51 M 49 43 L 49 50" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>

            {/* Right Hand with Shirt Sleeve */}
            <motion.g
              initial={false}
              animate={{
                y: isHandsCovering ? 0 : isPeeking ? 15 : 55,
                opacity: isHandsCovering || isPeeking ? 1 : 0,
                scale: isHandsCovering ? 1 : isPeeking ? 0.95 : 0.6,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              style={{ transformOrigin: '76px 58px' }}
            >
              {/* Sleeve */}
              <rect x="59" y="58" width="36" height="14" rx="4" fill="#1E40AF" stroke="#1D4ED8" strokeWidth="1" />
              {/* Palm / Hand */}
              <rect
                x="60"
                y="43"
                width="34"
                height="22"
                rx="10"
                fill="#FDBA74"
                stroke="#FB923C"
                strokeWidth="1.5"
              />
              {/* Fingers detail */}
              <path d="M 68 43 L 68 50 M 76 43 L 76 51 M 84 43 L 84 50" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>

            {/* Gradients */}
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ── Login Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
        className="relative z-10 w-full flex-1 flex flex-col justify-between rounded-t-[38px] bg-white px-6 pt-20 pb-7 text-slate-900 shadow-[0_-20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/80"
      >
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Email / Employee ID Field */}
            <div>
              <label className="mb-1 block text-[12.5px] font-black uppercase tracking-wider text-slate-500">
                Employee ID or Work Email
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-4 text-slate-400">
                  <Mail className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="EMP-001 or email@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-4 text-[15px] font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[12.5px] font-black uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12.5px] font-black text-brand-blue transition hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-4 text-slate-400">
                  <Lock className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-12 text-[15px] font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400 shadow-sm outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2.2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4.5 w-4.5 rounded-lg border-slate-300 text-brand-blue accent-brand-blue focus:ring-brand-blue"
                />
                <span className="text-[13.5px] font-bold text-slate-600">
                  Remember this device
                </span>
              </label>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="pt-2 space-y-3">
            {/* Sign In Primary Action */}
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden flex flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#225c99] via-[#2f6fad] to-[#4B89CD] py-3.5 text-[16px] font-black text-white shadow-[0_10px_28px_rgba(47,111,173,0.4)] transition hover:opacity-95 active:scale-[0.98] disabled:opacity-90"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </>
                )}
              </motion.button>

              {/* Biometric Button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                disabled={isLoading}
                onClick={handleBiometricAuth}
                className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-brand-blue/20 bg-brand-blue/10 text-brand-blue shadow-sm transition hover:bg-brand-blue/15 active:scale-90 disabled:opacity-50"
                aria-label="Biometric Login"
                title="Sign in with Face ID or Fingerprint"
              >
                <Fingerprint className="h-6.5 w-6.5" strokeWidth={2.2} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                </span>
              </motion.button>
            </div>

            {/* Footer note */}
            <div className="pt-0.5 text-center">
              <p className="text-[12px] font-bold text-slate-400">
                Need help signing in? Contact{' '}
                <span className="text-brand-blue font-black">IT Support</span>
              </p>
            </div>
          </div>
        </form>
      </motion.div>

      {/* ── High-Impact Fullscreen Interactive Loading Overlay ── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/70 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative flex w-full max-w-xs flex-col items-center rounded-3xl border border-white/20 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-2xl"
            >
              {/* Glowing Pulse Orb */}
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-brand-blue/20 animate-ping opacity-75" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2f6fad] to-[#4B89CD] text-white shadow-lg shadow-blue-500/40">
                  {loadingStep === 3 ? (
                    <CheckCircle2 className="h-9 w-9 text-emerald-300" strokeWidth={2.4} />
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin text-white" strokeWidth={2.6} />
                  )}
                </div>
              </div>

              {/* Dynamic Status Text */}
              <h3 className="hrms-display text-[17px] font-black text-slate-900">
                {loadingStep === 1 && 'Authenticating...'}
                {loadingStep === 2 && 'Connecting to HRMS Portal...'}
                {loadingStep === 3 && 'Access Granted!'}
              </h3>

              <p className="mt-1 text-[13px] font-bold text-slate-500">
                {loadingStep === 1 && 'Verifying employee credentials'}
                {loadingStep === 2 && 'Loading personal workspace'}
                {loadingStep === 3 && `Welcome back, ${currentUser.name.split(' ')[0]}!`}
              </p>

              {/* Animated Progress Bar */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-brand-blue"
                  initial={{ width: '15%' }}
                  animate={{
                    width: loadingStep === 1 ? '45%' : loadingStep === 2 ? '80%' : '100%',
                    backgroundColor: loadingStep === 3 ? '#43A751' : '#4B89CD',
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Verified Badge */}
              <div className="mt-3.5 flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11.5px] font-black text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-blue" />
                <span>256-Bit Encrypted Session</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
