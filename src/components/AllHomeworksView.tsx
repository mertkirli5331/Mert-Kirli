import React, { useState } from 'react';
import { Homework, DayId } from '../types';
import {
  Search,
  CheckCircle2,
  Circle,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { getSubjectStyle, PRIORITY_CONFIG, playCompletionSound } from '../utils/helpers';

interface AllHomeworksViewProps {
  homeworks: Homework[];
  currentWeek: number;
  onToggleComplete: (id: string) => void;
  onDeleteHomework: (id: string) => void;
  onOpenAddModal: (dayId: DayId) => void;
  onOpenEditModal: (homework: Homework) => void;
  onSelectWeek: (week: number) => void;
}

const dayLabels: Record<DayId, string> = {
  mon: '1. Gün',
  tue: '2. Gün',
  wed: '3. Gün',
  thu: '4. Gün',
  fri: '5. Gün',
};

export const AllHomeworksView: React.FC<AllHomeworksViewProps> = ({
  homeworks,
  currentWeek,
  onToggleComplete,
  onDeleteHomework,
  onOpenAddModal,
  onOpenEditModal,
  onSelectWeek,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weekScope, setWeekScope] = useState<'current' | 'all'>('current');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const filtered = homeworks.filter((h) => {
    if (weekScope === 'current' && h.weekNumber !== currentWeek) return false;
    if (statusFilter === 'pending' && h.completed) return false;
    if (statusFilter === 'completed' && !h.completed) return false;
    if (subjectFilter !== 'all' && h.subject !== subjectFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        h.title.toLowerCase().includes(q) ||
        h.description?.toLowerCase().includes(q) ||
        h.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allSubjects = Array.from(new Set(homeworks.map((h) => h.subject)));

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-cyan-950/20 border border-cyan-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ödev Takip Merkezi</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
              {filtered.length} Ödev
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Tüm haftaların ve günlerin ödevlerini filtreleyin, arayın ve yönetin
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal('mon')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-[#006473] hover:bg-[#004f5b] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ödev</span>
        </button>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ödev başlığı, ders veya konu ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        {/* Scope: Current week vs All 30 weeks */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setWeekScope('current')}
            className={`px-3 py-1.5 rounded-lg transition ${
              weekScope === 'current'
                ? 'bg-[#006473] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {currentWeek}. Hafta
          </button>
          <button
            onClick={() => setWeekScope('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              weekScope === 'all'
                ? 'bg-[#006473] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm 30 Hafta
          </button>
        </div>
      </div>

      {/* Filters: Status & Subject */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3 h-3" /> Durum:
        </span>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-2.5 py-1 rounded-lg flex-shrink-0 font-medium ${
            statusFilter === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tümü
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-2.5 py-1 rounded-lg flex-shrink-0 font-medium ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          Bekleyenler
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-2.5 py-1 rounded-lg flex-shrink-0 font-medium ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Tamamlananlar
        </button>

        <span className="text-slate-300 mx-1">|</span>

        <span className="text-slate-400 font-semibold flex-shrink-0">Ders:</span>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="bg-slate-100 border-none rounded-lg px-2 py-1 text-slate-700 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none text-xs"
        >
          <option value="all">Tüm Dersler</option>
          {allSubjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Homework List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Arama veya filtre kriterlerinize uyan ödev bulunamadı.
          </div>
        ) : (
          filtered.map((hw) => {
            const style = getSubjectStyle(hw.subject);
            const priorityConf = PRIORITY_CONFIG[hw.priority] || PRIORITY_CONFIG.medium;

            return (
              <div
                key={hw.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  hw.completed
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      if (!hw.completed) playCompletionSound();
                      onToggleComplete(hw.id);
                    }}
                    className="mt-0.5 text-slate-400 hover:text-cyan-600 transition"
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {hw.subject}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-50 text-[#006473] border border-cyan-200">
                        {hw.weekNumber}. Hafta • {dayLabels[hw.dayId]}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${priorityConf.badge}`}
                      >
                        {priorityConf.label}
                      </span>
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        hw.completed ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {hw.title}
                    </h4>

                    {hw.description && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        {hw.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      {hw.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{hw.dueDate}</span>
                        </span>
                      )}
                      {hw.estimatedMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{hw.estimatedMinutes} dk</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(hw)}
                      className="p-1.5 text-slate-400 hover:text-cyan-700 rounded-lg"
                      title="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteHomework(hw.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
