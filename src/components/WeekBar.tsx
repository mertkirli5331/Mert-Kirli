import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';
import { WeekMenu, Homework } from '../types';

interface WeekBarProps {
  weeks: WeekMenu[];
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  homeworks: Homework[];
  onOpenWeeksGrid: () => void;
}

export const WeekBar: React.FC<WeekBarProps> = ({
  weeks,
  selectedWeek,
  onSelectWeek,
  homeworks,
  onOpenWeeksGrid,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected week button into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-week="${selectedWeek}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedWeek]);

  const handlePrev = () => {
    if (selectedWeek > 1) {
      onSelectWeek(selectedWeek - 1);
    }
  };

  const handleNext = () => {
    if (selectedWeek < 30) {
      onSelectWeek(selectedWeek + 1);
    }
  };

  const currentWeekData = weeks.find((w) => w.weekNumber === selectedWeek);

  return (
    <div className="w-full bg-[#003c46]/90 border-b border-cyan-400/20 py-2.5 px-3 sm:px-4 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
        {/* Top summary row of week selector */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              30 Haftalık Takvim:
            </span>
            <span className="font-semibold text-white bg-cyan-900/80 px-2.5 py-0.5 rounded-lg border border-cyan-400/30">
              {selectedWeek}. Hafta
            </span>
            <span className="text-cyan-200/70 hidden sm:inline">
              ({selectedWeek <= 15 ? '1. Dönem' : '2. Dönem'})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenWeeksGrid}
              className="flex items-center gap-1 text-xs text-cyan-200 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-400/25 px-2.5 py-1 rounded-lg transition"
              title="30 Haftanın Tamamını Gör"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-300" />
              <span>Tüm 30 Haftayı Aç</span>
            </button>
          </div>
        </div>

        {/* Scrollable 30 Weeks Strip */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Previous week button */}
          <button
            onClick={handlePrev}
            disabled={selectedWeek === 1}
            aria-label="Önceki Hafta"
            className={`p-1.5 rounded-xl border transition flex-shrink-0 ${
              selectedWeek === 1
                ? 'opacity-40 cursor-not-allowed border-transparent text-cyan-300/40'
                : 'bg-cyan-900/70 hover:bg-cyan-800 text-cyan-100 border-cyan-400/30 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* 30-week horizontal scroll track */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth flex-1"
          >
            {weeks.map((week) => {
              const isSelected = week.weekNumber === selectedWeek;
              const weekTasks = homeworks.filter(
                (h) => h.weekNumber === week.weekNumber
              );
              const pendingCount = weekTasks.filter((h) => !h.completed).length;

              return (
                <button
                  key={week.weekNumber}
                  data-week={week.weekNumber}
                  onClick={() => onSelectWeek(week.weekNumber)}
                  className={`flex-shrink-0 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[85px] border ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-400 to-teal-400 text-cyan-950 border-white shadow-md shadow-cyan-950/40 scale-105 font-bold'
                      : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-100 border-cyan-500/30 hover:border-cyan-400/60'
                  }`}
                >
                  <span className="whitespace-nowrap">
                    {week.weekNumber}. Hafta
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px]">
                    {weekTasks.length > 0 ? (
                      pendingCount === 0 ? (
                        <span
                          className={`px-1.5 py-0.2 rounded-full font-medium ${
                            isSelected
                              ? 'bg-[#003842] text-cyan-200'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          Tamam ✓
                        </span>
                      ) : (
                        <span
                          className={`px-1.5 py-0.2 rounded-full font-medium ${
                            isSelected
                              ? 'bg-[#003842] text-amber-200'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {pendingCount} ödev
                        </span>
                      )
                    ) : (
                      <span
                        className={`text-[9px] ${
                          isSelected ? 'text-cyan-900' : 'text-cyan-400/60'
                        }`}
                      >
                        {week.semester === 1 ? '1. Dönem' : '2. Dönem'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next week button */}
          <button
            onClick={handleNext}
            disabled={selectedWeek === 30}
            aria-label="Sonraki Hafta"
            className={`p-1.5 rounded-xl border transition flex-shrink-0 ${
              selectedWeek === 30
                ? 'opacity-40 cursor-not-allowed border-transparent text-cyan-300/40'
                : 'bg-cyan-900/70 hover:bg-cyan-800 text-cyan-100 border-cyan-400/30 active:scale-95'
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Current week theme badge */}
        {currentWeekData && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#002f37]/80 border border-cyan-400/20 text-cyan-200 text-xs sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
            <span className="font-semibold text-white truncate">
              {currentWeekData.theme}
            </span>
            <span className="text-cyan-400/60 hidden sm:inline">•</span>
            <span className="text-cyan-300/80 hidden sm:inline">
              Mert Kirli Menü & Ödev Planı
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
