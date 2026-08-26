import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav, type TabId } from './components/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeavePage } from './pages/LeavePage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RadialFloatingMenu } from './components/RadialFloatingMenu';
import { PayslipModal } from './components/PayslipModal';
import { ScheduleModal } from './components/ScheduleModal';
import { NewRequestModal } from './components/NewRequestModal';

const PAGE_TITLES: Record<TabId, string> = {
  dashboard: 'My Dashboard',
  attendance: 'My Attendance',
  leave: 'Leave Management',
  approvals: 'My Requests',
  notifications: 'Inbox Alerts',
  profile: 'My Profile',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [openLeaveFromFab, setOpenLeaveFromFab] = useState<boolean>(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isShiftSwapOpen, setIsShiftSwapOpen] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top on tab change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleRadialAction = (actionId: string) => {
    if (actionId === 'leave') {
      setActiveTab('leave');
      setOpenLeaveFromFab(true);
    } else if (actionId === 'clock') {
      setActiveTab('attendance');
    } else if (actionId === 'schedule') {
      setIsScheduleOpen(true);
    } else if (actionId === 'eforms') {
      setIsPayslipOpen(true);
    } else if (actionId === 'team') {
      setActiveTab('profile');
    }
  };

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <LoginPage onLogin={() => setIsAuthenticated(true)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative flex h-screen h-dvh w-full flex-col overflow-hidden bg-gradient-to-b from-[#eef4fa] via-[#f7f9fc] to-[#f4f7f9]">
      {/* ── Header ── */}
      {activeTab === 'dashboard' ? (
        <Header
          showGreeting
          onLogout={() => setIsAuthenticated(false)}
        />
      ) : (
        <Header
          title={PAGE_TITLES[activeTab]}
          onLogout={() => setIsAuthenticated(false)}
        />
      )}

      {/* ── Main Content ── */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden hrms-scroll"
      >
        <div className="w-full pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full"
            >
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'attendance' && <AttendancePage />}
              {activeTab === 'leave' && (
                <LeavePage
                  forceOpenForm={openLeaveFromFab}
                  onResetForceOpen={() => setOpenLeaveFromFab(false)}
                />
              )}
              {activeTab === 'approvals' && <ApprovalsPage />}
              {activeTab === 'notifications' && <NotificationsPage />}
              {activeTab === 'profile' && (
                <ProfilePage onLogout={() => setIsAuthenticated(false)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Radial Floating Action Menu ── */}
      <RadialFloatingMenu onActionSelect={handleRadialAction} />

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Global Modals ── */}
      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onRequestShiftChange={() => setIsShiftSwapOpen(true)}
      />

      <NewRequestModal
        isOpen={isShiftSwapOpen}
        initialType="schedule-change"
        onClose={() => setIsShiftSwapOpen(false)}
        onSubmitSuccess={() => {}}
      />
    </div>
  );
}
