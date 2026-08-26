// ─── Mock Data for HRMS Mobile (1:1 Employee Self-Service) ───

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive';
  gender: 'Male' | 'Female' | 'Diverse';
}

export interface AttendanceRecord {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hours: number;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  appliedDate: string;
}

export interface MyRequestItem {
  id: string;
  type: 'leave' | 'overtime' | 'official-business' | 'schedule-change';
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approver: string;
  remarks?: string;
}

// ─── Current Logged-in Employee (1:1 Personal Data) ───
export const currentUser: Employee = {
  id: 'EMP-001',
  name: 'Juan Dela Cruz',
  position: 'Senior Developer',
  department: 'IT & Software Engineering',
  email: 'juan.delacruz@company.com',
  avatar: '',
  status: 'active',
  gender: 'Male',
};

// ─── My Personal Monthly Summary Stats ───
export const myEmployeeStats = {
  daysPresent: 20,
  daysAbsent: 1,
  daysLate: 1,
  overtimeHours: 4.5,
  leaveCreditsRemaining: 25,
  attendanceRate: '95.2%',
  shiftSchedule: '08:00 AM – 05:00 PM',
  todayClockIn: '08:15 AM',
  todayClockOut: null,
  todayHoursRendered: 6.75,
  healthDeclarationStatus: 'Cleared & Certified',
};

// ─── My Personal Requests (Leave, Overtime, Shift, OB) ───
export const myPersonalRequests: MyRequestItem[] = [
  {
    id: 'REQ-001',
    type: 'leave',
    title: 'Vacation Leave (3 Days)',
    description: 'Sep 01 – Sep 03, 2026 • Family vacation trip',
    date: '2026-09-01',
    status: 'approved',
    submittedDate: '2026-08-15',
    approver: 'Engr. Arthur Pendelton (Tech Lead)',
    remarks: 'Approved. Ensure handoff of ongoing sprint tasks.',
  },
  {
    id: 'REQ-002',
    type: 'leave',
    title: 'Sick Leave (1 Day)',
    description: 'Aug 20, 2026 • Not feeling well / Medical rest',
    date: '2026-08-20',
    status: 'approved',
    submittedDate: '2026-08-19',
    approver: 'HR Medical Team',
    remarks: 'Medical certificate validated.',
  },
  {
    id: 'REQ-003',
    type: 'schedule-change',
    title: 'Shift Change Request',
    description: 'Adjust shift to 7:00 AM – 4:00 PM for client deployment',
    date: '2026-08-28',
    status: 'pending',
    submittedDate: '2026-08-25',
    approver: 'Engr. Arthur Pendelton (Tech Lead)',
    remarks: 'Under review for shift coverage.',
  },
  {
    id: 'REQ-004',
    type: 'overtime',
    title: 'Overtime Request (3 Hours)',
    description: 'Aug 29, 2026 (5:00 PM – 8:00 PM) • Database migration',
    date: '2026-08-29',
    status: 'pending',
    submittedDate: '2026-08-26',
    approver: 'Project Manager',
  },
  {
    id: 'REQ-005',
    type: 'leave',
    title: 'Emergency Leave (1 Day)',
    description: 'Aug 10, 2026 • Family emergency',
    date: '2026-08-10',
    status: 'rejected',
    submittedDate: '2026-08-09',
    approver: 'HR Operations',
    remarks: 'Please submit supporting documentation.',
  },
];

// ─── This Week's Attendance (Juan Dela Cruz) ───
export const weeklyAttendance: AttendanceRecord[] = [
  { date: '2026-08-24', clockIn: '08:02', clockOut: '17:05', breakStart: '12:00', breakEnd: '13:00', status: 'present', hours: 8 },
  { date: '2026-08-25', clockIn: '07:58', clockOut: '17:10', breakStart: '12:00', breakEnd: '13:00', status: 'present', hours: 8.2 },
  { date: '2026-08-26', clockIn: '08:15', clockOut: null, breakStart: null, breakEnd: null, status: 'present', hours: 6.75 },
  { date: '2026-08-27', clockIn: null, clockOut: null, breakStart: null, breakEnd: null, status: 'absent', hours: 0 },
  { date: '2026-08-28', clockIn: null, clockOut: null, breakStart: null, breakEnd: null, status: 'absent', hours: 0 },
];

// ─── Monthly Attendance Calendar (Juan Dela Cruz) ───
export const monthlyAttendance: Record<number, 'present' | 'absent' | 'late' | 'half-day' | 'weekend'> = {
  1: 'present', 2: 'weekend', 3: 'weekend', 4: 'present', 5: 'present',
  6: 'present', 7: 'late', 8: 'present', 9: 'weekend', 10: 'weekend',
  11: 'present', 12: 'present', 13: 'present', 14: 'present', 15: 'half-day',
  16: 'weekend', 17: 'weekend', 18: 'present', 19: 'present', 20: 'present',
  21: 'absent', 22: 'present', 23: 'weekend', 24: 'weekend', 25: 'present',
  26: 'present',
};

// ─── Leave Balances (Juan Dela Cruz) ───
export const leaveBalances: LeaveBalance[] = [
  { type: 'Vacation Leave', total: 15, used: 5, remaining: 10, color: '#4B89CD' },
  { type: 'Sick Leave', total: 15, used: 3, remaining: 12, color: '#43A751' },
  { type: 'Emergency Leave', total: 3, used: 1, remaining: 2, color: '#64748b' },
  { type: 'Birthday Leave', total: 1, used: 0, remaining: 1, color: '#8B5CF6' },
];

// ─── Leave Requests (Juan Dela Cruz) ───
export const leaveRequests: LeaveRequest[] = [
  {
    id: 'LR-001',
    type: 'Vacation Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    days: 3,
    reason: 'Family vacation trip',
    status: 'approved',
    appliedDate: '2026-08-15',
  },
  {
    id: 'LR-002',
    type: 'Sick Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    days: 1,
    reason: 'Not feeling well / Medical rest',
    status: 'approved',
    appliedDate: '2026-08-19',
  },
  {
    id: 'LR-003',
    type: 'Vacation Leave',
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    days: 3,
    reason: 'Personal errands',
    status: 'pending',
    appliedDate: '2026-08-25',
  },
  {
    id: 'LR-004',
    type: 'Emergency Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-10',
    days: 1,
    reason: 'Family emergency',
    status: 'rejected',
    appliedDate: '2026-08-09',
  },
];

// ─── Profile Navigation Links ───
export interface ProfileLinkItem {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  badge?: string;
}

export const profileLinks: ProfileLinkItem[] = [
  { id: 'schedule', label: 'My Schedule', sublabel: 'View weekly shifts & rest days', icon: 'calendar-days' },
  { id: 'payslip', label: 'My Payslip', sublabel: 'View latest earnings & tax deductions', icon: 'file-text', badge: 'New' },
  { id: 'notifications', label: 'Notifications', sublabel: 'Approval alerts and announcements', icon: 'bell', badge: '3' },
  { id: 'biometrics', label: 'Biometric Credentials', sublabel: 'Face ID & Fingerprint setup', icon: 'fingerprint' },
  { id: 'settings', label: 'App Settings', sublabel: 'Theme, Privacy & Preferences', icon: 'settings' },
];

// ─── Digital Payslip Model & Data ───
export interface PayslipItem {
  id: string;
  period: string;
  payDate: string;
  cutoff: string;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  earnings: {
    basicSalary: number;
    overtimePay: number;
    allowances: number;
    nightDifferential?: number;
    holidayPay?: number;
  };
  deductions: {
    sss: number;
    philHealth: number;
    pagIbig: number;
    withholdingTax: number;
    lateDeductions?: number;
  };
}

export const payslipsList: PayslipItem[] = [
  {
    id: 'PS-2026-08-1',
    period: 'Aug 01 – Aug 15, 2026',
    payDate: 'August 15, 2026',
    cutoff: '1st Cutoff (15th Payday)',
    grossPay: 43250.0,
    netPay: 37820.5,
    totalDeductions: 5429.5,
    earnings: {
      basicSalary: 37500.0,
      overtimePay: 2750.0,
      allowances: 3000.0,
      nightDifferential: 0.0,
    },
    deductions: {
      sss: 1350.0,
      philHealth: 875.0,
      pagIbig: 200.0,
      withholdingTax: 2850.5,
      lateDeductions: 154.0,
    },
  },
  {
    id: 'PS-2026-07-2',
    period: 'Jul 16 – Jul 31, 2026',
    payDate: 'July 31, 2026',
    cutoff: '2nd Cutoff (End of Month)',
    grossPay: 44500.0,
    netPay: 38910.0,
    totalDeductions: 5590.0,
    earnings: {
      basicSalary: 37500.0,
      overtimePay: 4000.0,
      allowances: 3000.0,
    },
    deductions: {
      sss: 1350.0,
      philHealth: 875.0,
      pagIbig: 200.0,
      withholdingTax: 3165.0,
    },
  },
];

// ─── Work Schedule & Calendar ───
export interface ShiftDay {
  day: string;
  date: string;
  dayNumber: number;
  shift: string;
  isRestDay: boolean;
  isToday?: boolean;
  notes?: string;
}

export const myWeeklySchedule: ShiftDay[] = [
  { day: 'Mon', date: 'Aug 24, 2026', dayNumber: 24, shift: '08:00 AM – 05:00 PM', isRestDay: false },
  { day: 'Tue', date: 'Aug 25, 2026', dayNumber: 25, shift: '08:00 AM – 05:00 PM', isRestDay: false },
  { day: 'Wed', date: 'Aug 26, 2026', dayNumber: 26, shift: '08:00 AM – 05:00 PM', isRestDay: false, isToday: true },
  { day: 'Thu', date: 'Aug 27, 2026', dayNumber: 27, shift: '08:00 AM – 05:00 PM', isRestDay: false },
  { day: 'Fri', date: 'Aug 28, 2026', dayNumber: 28, shift: '08:00 AM – 05:00 PM', isRestDay: false },
  { day: 'Sat', date: 'Aug 29, 2026', dayNumber: 29, shift: 'OFF', isRestDay: true, notes: 'Rest Day' },
  { day: 'Sun', date: 'Aug 30, 2026', dayNumber: 30, shift: 'OFF', isRestDay: true, notes: 'Rest Day' },
];

export interface CompanyHoliday {
  name: string;
  date: string;
  type: 'Regular Holiday' | 'Special Non-Working';
}

export const upcomingHolidays: CompanyHoliday[] = [
  { name: 'National Heroes Day', date: 'August 31, 2026', type: 'Regular Holiday' },
  { name: 'All Saints Day', date: 'November 01, 2026', type: 'Special Non-Working' },
  { name: 'Bonifacio Day', date: 'November 30, 2026', type: 'Regular Holiday' },
  { name: 'Christmas Day', date: 'December 25, 2026', type: 'Regular Holiday' },
];
