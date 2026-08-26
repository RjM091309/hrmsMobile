import { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-50 flex h-7 w-full items-center justify-between px-5 text-white/90 select-none">
      {/* Time */}
      <span className="text-[12px] font-extrabold tracking-tight">
        {time || '9:41'}
      </span>

      {/* Dynamic Island / Notch Pill hint */}
      <div className="h-4 w-20 rounded-full bg-black/20 backdrop-blur-md" />

      {/* Icons */}
      <div className="flex items-center gap-2">
        <Signal className="h-3 w-3" strokeWidth={2.6} />
        <Wifi className="h-3 w-3" strokeWidth={2.6} />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-extrabold tracking-tight">100%</span>
          <BatteryMedium className="h-3.5 w-3.5" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}
