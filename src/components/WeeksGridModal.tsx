import React, { useState } from 'react';
import { WeekMenu, Homework } from '../types';
import { X, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface WeeksGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: WeekMenu[];
  selectedWeek: number;
  onSelectWeek: (weekNumber: number) => void;
  homeworks: Homework[];
}

export const WeeksGridModal: React.FC<WeeksGridModalProps> = ({
  isOpen,
  onClose,
  weeks,
  selectedWeek,
  onSelectWeek,
  homeworks,
}) => {
  const [semesterFilter, setSemesterFilter] = useState<'all' | 1 | 2>('all');

  if (!isOpen) return null;

  const filteredWeeks = weeks.filter((w) => {
    if (semesterFilter === 'all') return true;
    return w.semester === semesterFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cyan-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-cyan-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004b57] via-[#006473] to-[#088395] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-cyan-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                30 Haftalık Okul Takvimi & Menü Haritası
              </h3>
              <p className="text-xs text-cyan-200">
                Mert Kirli — Haftalık tıklayarak menüyü ve günlük ödevleri inceleyin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-cyan-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Semester Filter Tabs */}
        <div className="px-6 py-3 bg-cyan-50/70 border-b border-cyan-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-cyan-200 text-xs font-bold">
            <button
              onClick={() => setSemesterFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition ${
                semesterFilter === 'all'
                  ? 'bg-[#006473] text-white shadow-sm'
                  : 'text-slate-600 hover:text-cyan-800'
              }`}
            >
              Tüm 30 Hafta
            </button>
            <button
              onClick={() => setSemesterFilter(1)}
              className={`px-3 py-1.5 rounded-xl transition ${
                semesterFilter === 1
                  ? 'bg-[#006473] text-white shadow-sm'
                  : 'text-slate-600 hover:text-cyan-800'
              }`}
            >
              1. Dönem (1 - 15)
            </button>
            <button
              onClick={() => setSemesterFilter(2)}
              className={`px-3 py-1.5 rounded-xl transition ${
                semesterFilter === 2
                  ? 'bg-[#006473] text-white shadow-sm'
                  : 'text-slate-600 hover:text-cyan-800'
              }`}
            >
              2. Dönem (16 - 30)
            </button>
          </div>

          <div className="text-xs text-cyan-900 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Aktif Seçili: <strong>{selectedWeek}. Hafta</strong></span>
          </div>
        </div>

        {/* 30 Weeks Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWeeks.map((week) => {
            const isCurrent = week.weekNumber === selectedWeek;
            const weekTasks = homeworks.filter(
              (h) => h.weekNumber === week.weekNumber
            );
            const completedCount = weekTasks.filter((h) => h.completed).length;
            const totalTasks = weekTasks.length;

            return (
              <button
                key={week.weekNumber}
                onClick={() => {
                  onSelectWeek(week.weekNumber);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-[#006473] shadow-md'
                    : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                        isCurrent
                          ? 'bg-[#006473] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {week.weekNumber}. Hafta
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {week.semester === 1 ? '1. Dönem' : '2. Dönem'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#006473]">
                    {week.theme}
                  </h4>

                  {/* Sample dishes preview */}
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    Öğle: {week.days.mon.main}, {week.days.wed.main}...
                  </p>
                </div>

                {/* Bottom stats */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    {totalTasks > 0 ? (
                      <span
                        className={`font-semibold ${
                          completedCount === totalTasks
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {completedCount}/{totalTasks} Ödev
                      </span>
                    ) : (
                      <span className="text-slate-400">Ödev yok</span>
                    )}
                  </div>

                  <span className="text-cyan-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Görüntüle
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
