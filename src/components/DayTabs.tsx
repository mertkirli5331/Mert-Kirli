import React from 'react';
import { DayId, DayMenu, Homework } from '../types';
import { Utensils, BookOpen, CheckCircle2 } from 'lucide-react';

interface DayTabsProps {
  daysMenu: Record<DayId, DayMenu>;
  selectedDay: DayId;
  onSelectDay: (day: DayId) => void;
  dayHomeworks: Record<DayId, Homework[]>;
}

const dayList: { id: DayId; label: string; short: string }[] = [
  { id: 'mon', label: '1. Gün', short: '1. Gün' },
  { id: 'tue', label: '2. Gün', short: '2. Gün' },
  { id: 'wed', label: '3. Gün', short: '3. Gün' },
  { id: 'thu', label: '4. Gün', short: '4. Gün' },
  { id: 'fri', label: '5. Gün', short: '5. Gün' },
];

export const DayTabs: React.FC<DayTabsProps> = ({
  daysMenu,
  selectedDay,
  onSelectDay,
  dayHomeworks,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {dayList.map((day) => {
          const isSelected = selectedDay === day.id;
          const menu = daysMenu[day.id];
          const hw = dayHomeworks[day.id] || [];
          const pendingHw = hw.filter((h) => !h.completed).length;
          const allCompleted = hw.length > 0 && pendingHw === 0;

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`relative flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl border transition-all text-left group ${
                isSelected
                  ? 'bg-white text-slate-900 border-cyan-300 shadow-lg shadow-cyan-950/30 ring-2 ring-cyan-400'
                  : 'bg-[#004752]/70 hover:bg-[#00515e]/80 text-white border-cyan-400/25'
              }`}
            >
              {/* Day title & date badge */}
              <div className="w-full flex items-center justify-between gap-1">
                <span
                  className={`font-black text-xs sm:text-sm tracking-tight ${
                    isSelected ? 'text-[#004b57]' : 'text-cyan-100'
                  }`}
                >
                  <span className="sm:hidden">{day.short}</span>
                  <span className="hidden sm:inline">{day.label}</span>
                </span>

                {/* Homework status dot / badge */}
                {hw.length > 0 && (
                  <div className="flex-shrink-0">
                    {allCompleted ? (
                      <span
                        className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-emerald-500 text-white'
                        }`}
                        title="Tüm ödevler tamamlandı"
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full font-bold ${
                          isSelected
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-amber-500 text-white'
                        }`}
                        title={`${pendingHw} bekleyen ödev`}
                      >
                        {pendingHw}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Main Dish quick teaser */}
              <div className="w-full mt-1.5 hidden sm:block">
                <div
                  className={`text-[11px] font-medium truncate flex items-center gap-1 ${
                    isSelected ? 'text-slate-600' : 'text-cyan-200/80'
                  }`}
                >
                  <Utensils className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{menu?.main || 'Günün Menüsü'}</span>
                </div>
              </div>

              {/* Mobile micro label */}
              <div className="w-full mt-1 sm:hidden text-[9px] truncate text-center opacity-80">
                {hw.length > 0 ? `${hw.length} Ödev` : 'Menü'}
              </div>

              {/* Bottom active pill indicator */}
              {isSelected && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
