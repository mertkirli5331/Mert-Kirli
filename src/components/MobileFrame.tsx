import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isSimulated: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isSimulated }) => {
  if (!isSimulated) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen py-6 px-4 flex items-center justify-center bg-[#00343d]">
      {/* Smartphone Outer Shell */}
      <div className="w-full max-w-[430px] h-[90vh] max-h-[880px] bg-black rounded-[48px] p-3.5 shadow-2xl shadow-cyan-950/80 border-4 border-slate-700/80 flex flex-col relative ring-1 ring-cyan-400/40">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-[#002f37] border border-cyan-500/30"></div>
        </div>

        {/* Screen inner */}
        <div className="w-full h-full bg-[#00515e] rounded-[38px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="h-9 px-6 flex items-center justify-between text-white text-[11px] font-semibold select-none z-40 bg-[#004b57]">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-cyan-200">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4 text-cyan-300 fill-cyan-300" />
            </div>
          </div>

          {/* App Contents inside mobile viewport with custom scrollbar */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
            {children}
          </div>

          {/* Home indicator bar at bottom */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
