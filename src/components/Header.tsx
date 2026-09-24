import React from 'react';
import {
  GraduationCap,
  Flame,
  Smartphone,
  Monitor,
  Printer,
  CalendarDays,
  CheckCircle2,
  User,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentWeek: number;
  totalWeeks: number;
  completedTasksCount: number;
  totalTasksCount: number;
  userProfile: UserProfile;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  onOpenProfile: () => void;
  onOpenWeeksGrid: () => void;
  onOpenPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWeek,
  totalWeeks,
  completedTasksCount,
  totalTasksCount,
  userProfile,
  isMobileView,
  onToggleMobileView,
  onOpenProfile,
  onOpenWeeksGrid,
  onOpenPrint,
}) => {
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <header className="w-full bg-[#004b57]/95 border-b border-cyan-400/25 backdrop-blur-md sticky top-0 z-40 text-white shadow-lg shadow-cyan-950/20">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="relative group focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-2xl"
            title="Mert Kirli Profilini Görüntüle"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-300 to-cyan-100 p-0.5 shadow-md shadow-cyan-950/40 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#003842] rounded-[14px] flex items-center justify-center text-cyan-200 font-bold text-sm sm:text-base tracking-wide">
                MK
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#003842] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Mert Kirli</span>
                <span className="text-cyan-300 font-medium text-xs sm:text-sm px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/30">
                  Web Sitesi
                </span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-cyan-100/80 font-medium flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              <span>30 Haftalık Menü & Günlük Ödev Takibi</span>
            </p>
          </div>
        </div>

        {/* Quick Stats & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak indicator */}
          <div
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-amber-300 text-xs font-semibold cursor-pointer hover:bg-cyan-900/60 transition"
            title="Ödev Yapma Serisi"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{userProfile.streakDays} Gün Seri</span>
          </div>

          {/* Current Week Quick Jump Button */}
          <button
            onClick={onOpenWeeksGrid}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-400/30 border border-cyan-300/40 text-cyan-100 text-xs sm:text-sm font-semibold transition active:scale-95 shadow-sm"
            title="30 Hafta Listesini Aç"
          >
            <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
            <span className="font-bold text-white">{currentWeek}</span>
            <span className="text-cyan-200/70">/{totalWeeks}. Hafta</span>
          </button>

          {/* Print / Save View */}
          <button
            onClick={onOpenPrint}
            className="p-1.5 sm:p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-400/20 text-cyan-200 hover:text-white transition"
            title="Haftalık Menü ve Ödevleri Yazdır / PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Mobile Simulator / Web Fullscreen View Toggle */}
          <button
            onClick={onToggleMobileView}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
              isMobileView
                ? 'bg-cyan-400 text-[#003842] border-cyan-300 shadow-md font-bold'
                : 'bg-cyan-950/50 text-cyan-200 border-cyan-400/20 hover:bg-cyan-900/60'
            }`}
            title="Mobil Uygulama Çerçevesi / Web Görünümü Değiştir"
          >
            {isMobileView ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Web Görünüm</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobil Simülatör</span>
              </>
            )}
          </button>

          {/* Profile button */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 sm:p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-400/20 text-cyan-200 hover:text-white transition"
            title="Mert Kirli Bilgileri"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
