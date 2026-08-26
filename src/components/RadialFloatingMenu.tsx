import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Clock,
  CalendarPlus,
  CalendarDays,
  Users,
  FileText,
} from 'lucide-react';

interface RadialFloatingMenuProps {
  onActionSelect?: (actionId: string) => void;
}

interface SpeedDialAction {
  id: string;
  label: string;
  Icon: typeof Clock;
}

const SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  {
    id: 'clock',
    label: 'Time In / Out',
    Icon: Clock,
  },
  {
    id: 'leave',
    label: 'File Leave',
    Icon: CalendarPlus,
  },
  {
    id: 'schedule',
    label: 'My Schedule',
    Icon: CalendarDays,
  },
  {
    id: 'team',
    label: 'Team Directory',
    Icon: Users,
  },
  {
    id: 'eforms',
    label: 'eForms',
    Icon: FileText,
  },
];

export function RadialFloatingMenu({ onActionSelect }: RadialFloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const toggleMenu = () => {
    if (!isDragging) {
      setIsOpen((prev) => !prev);
    }
  };

  const closeMenu = () => setIsOpen(false);

  const handleAction = (id: string) => {
    closeMenu();
    if (onActionSelect) {
      onActionSelect(id);
    }
  };

  return (
    <>
      {/* ── Backdrop Blur Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* ── Draggable Floating Speed Dial Container ── */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={(_, info) => {
          dragStartPos.current = { x: info.point.x, y: info.point.y };
          setIsDragging(false);
        }}
        onDrag={(_, info) => {
          const dx = Math.abs(info.point.x - dragStartPos.current.x);
          const dy = Math.abs(info.point.y - dragStartPos.current.y);
          if (dx > 6 || dy > 6) {
            setIsDragging(true);
          }
        }}
        onDragEnd={() => {
          setTimeout(() => setIsDragging(false), 80);
        }}
        className="fixed bottom-28 right-6 z-50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* ── Vertical Speed Dial Action Buttons ── */}
        <AnimatePresence>
          {isOpen && (
            <div className="pointer-events-auto absolute bottom-[66px] right-0 flex flex-col items-end gap-3 pb-2">
              {SPEED_DIAL_ACTIONS.map((action, index) => {
                const { Icon } = action;
                const reverseIndex = SPEED_DIAL_ACTIONS.length - 1 - index;

                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      y: 15,
                      transition: { duration: 0.12, delay: index * 0.015 },
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                      delay: reverseIndex * 0.035,
                    }}
                    onClick={() => handleAction(action.id)}
                    className="flex items-center gap-2.5 cursor-pointer group pr-1"
                  >
                    {/* Clean Left-Aligned Label Pill */}
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reverseIndex * 0.035 + 0.08 }}
                      className="whitespace-nowrap rounded-full bg-slate-900/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xl ring-1 ring-white/20 transition-transform group-hover:scale-105"
                    >
                      {action.label}
                    </motion.span>

                    {/* Circular Action Icon Button (Centered right over the main FAB) */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-2 ring-white/90 transition-transform group-hover:bg-slate-800 active:scale-90"
                      aria-label={action.label}
                    >
                      <Icon className="h-5.5 w-5.5 text-white" strokeWidth={2.4} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* ── Main Draggable Central FAB ── */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={toggleMenu}
          className={`
            relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] ring-4 ring-white/90 transition-all duration-300
            ${
              isOpen
                ? 'bg-slate-900 shadow-slate-900/50'
                : 'bg-gradient-to-tr from-[#164373] via-[#2f6fad] to-[#4B89CD] shadow-blue-500/40'
            }
          `}
          aria-label="Toggle Quick Actions Menu"
        >
          {/* Animated Rotating Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" strokeWidth={2.8} />
            ) : (
              <Plus className="h-6 w-6 text-white" strokeWidth={2.8} />
            )}
          </motion.div>

          {/* Glowing Ring when idle */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-brand-blue/30 animate-pulse-ring pointer-events-none" />
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
