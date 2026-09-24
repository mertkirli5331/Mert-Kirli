import React from 'react';
import { Utensils, ListTodo, CalendarDays, User, Sparkles } from 'lucide-react';

export type ActiveTab = 'day-view' | 'all-homeworks' | 'weeks-grid' | 'profile';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingHomeworkCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingHomeworkCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#003842]/95 border-t border-cyan-400/30 backdrop-blur-lg text-cyan-200 px-3 py-2 sm:hidden shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Day View (Menu & Homework) */}
        <button
          onClick={() => onSelectTab('day-view')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'day-view'
              ? 'text-cyan-300 font-bold scale-105'
              : 'text-cyan-200/60 hover:text-cyan-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${
              activeTab === 'day-view' ? 'bg-cyan-400/20' : ''
            }`}
          >
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Menü & Gün</span>
        </button>

        {/* All Homeworks */}
        <button
          onClick={() => onSelectTab('all-homeworks')}
          className={`flex flex-col items-center gap-1 transition relative ${
            activeTab === 'all-homeworks'
              ? 'text-cyan-300 font-bold scale-105'
              : 'text-cyan-200/60 hover:text-cyan-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl relative ${
              activeTab === 'all-homeworks' ? 'bg-cyan-400/20' : ''
            }`}
          >
            <ListTodo className="w-5 h-5" />
            {pendingHomeworkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-cyan-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {pendingHomeworkCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Ödevlerim</span>
        </button>

        {/* 30 Weeks Map */}
        <button
          onClick={() => onSelectTab('weeks-grid')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'weeks-grid'
              ? 'text-cyan-300 font-bold scale-105'
              : 'text-cyan-200/60 hover:text-cyan-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${
              activeTab === 'weeks-grid' ? 'bg-cyan-400/20' : ''
            }`}
          >
            <CalendarDays className="w-5 h-5" />
          </div>
          <span className="text-[10px]">30 Hafta</span>
        </button>

        {/* Mert Kirli Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'profile'
              ? 'text-cyan-300 font-bold scale-105'
              : 'text-cyan-200/60 hover:text-cyan-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${
              activeTab === 'profile' ? 'bg-cyan-400/20' : ''
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Mert Kirli</span>
        </button>
      </div>
    </nav>
  );
};
