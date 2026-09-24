import React, { useState } from 'react';
import { Homework, DayId, DayMenu } from '../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  BookOpen,
  Trash2,
  Edit3,
  CheckCheck,
  Sparkles,
  Filter,
  BookmarkPlus,
  Smile,
  ListTodo
} from 'lucide-react';
import { getSubjectStyle, PRIORITY_CONFIG, playCompletionSound } from '../utils/helpers';

interface HomeworkTrackerProps {
  dayId: DayId;
  dayMenu: DayMenu;
  weekNumber: number;
  homeworks: Homework[];
  onToggleComplete: (id: string) => void;
  onDeleteHomework: (id: string) => void;
  onOpenAddModal: (dayId: DayId, subjectPreset?: string) => void;
  onOpenEditModal: (homework: Homework) => void;
  onAddQuickTemplate: (dayId: DayId, template: { title: string; subject: string; minutes: number }) => void;
}

export const HomeworkTracker: React.FC<HomeworkTrackerProps> = ({
  dayId,
  dayMenu,
  weekNumber,
  homeworks,
  onToggleComplete,
  onDeleteHomework,
  onOpenAddModal,
  onOpenEditModal,
  onAddQuickTemplate,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const completedCount = homeworks.filter((h) => h.completed).length;
  const totalCount = homeworks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredList = homeworks.filter((h) => {
    if (filter === 'pending') return !h.completed;
    if (filter === 'completed') return h.completed;
    return true;
  });

  const handleCheck = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      playCompletionSound();
    }
    onToggleComplete(id);
  };

  const quickTemplates = [
    { title: '30 Sayfa Kitap Okuma & Özet', subject: 'Türkçe', minutes: 30 },
    { title: 'Matematik 25 Soru Test Çözümü', subject: 'Matematik', minutes: 40 },
    { title: 'İngilizce Yeni Kelime Ezberi', subject: 'İngilizce', minutes: 20 },
    { title: 'Fen Bilimleri Konu Tekrarı', subject: 'Fen Bilimleri', minutes: 35 },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-cyan-950/20 border border-cyan-100 flex flex-col gap-4">
      {/* Tracker Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-inner">
            <ListTodo className="w-5 h-5 text-[#006473]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {dayMenu.dayName} Ödev Takibi
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {completedCount}/{totalCount} Yapıldı
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Mert Kirli Günlük Ders ve Görev Kontrol Listesi
            </p>
          </div>
        </div>

        {/* Add Homework Button */}
        <button
          onClick={() => onOpenAddModal(dayId)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#006473] to-[#088395] hover:from-[#004f5b] hover:to-[#006473] text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-950/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ödev Ekle</span>
        </button>
      </div>

      {/* Progress Bar & Filter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Günlük Ödev İlerlemesi
          </span>
          <span
            className={`font-black ${
              progressPercent === 100 ? 'text-emerald-600' : 'text-cyan-800'
            }`}
          >
            %{progressPercent} Tamamlandı
          </span>
        </div>

        {/* Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercent === 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 mt-1 pt-1 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({totalCount})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'pending'
                  ? 'bg-white text-amber-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bekleyen ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filter === 'completed'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Biten ({completedCount})
            </button>
          </div>

          {totalCount > 0 && completedCount === totalCount && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Günün tüm ödevleri bitti! Harika iş 🌟</span>
            </div>
          )}
        </div>
      </div>

      {/* Homework List */}
      <div className="space-y-2.5 min-h-[140px]">
        {filteredList.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl border-2 border-dashed border-cyan-100 bg-cyan-50/30 flex flex-col items-center justify-center gap-2">
            <Smile className="w-8 h-8 text-cyan-500" />
            <p className="text-sm font-bold text-slate-700">
              {filter === 'completed'
                ? 'Henüz tamamlanan ödev bulunmuyor.'
                : filter === 'pending'
                ? 'Harika! Bekleyen hiçbir ödev kalmadı 🎉'
                : `${dayMenu.dayName} günü için henüz ödev eklenmemiş.`}
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              Aşağıdaki hızlı şablonlardan birine tıklayarak veya yeni ödev butonunu kullanarak ödev ekleyebilirsin.
            </p>
          </div>
        ) : (
          filteredList.map((hw) => {
            const style = getSubjectStyle(hw.subject);
            const priorityConf = PRIORITY_CONFIG[hw.priority] || PRIORITY_CONFIG.medium;

            return (
              <div
                key={hw.id}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all ${
                  hw.completed
                    ? 'bg-slate-50/80 border-slate-200/80 opacity-75'
                    : 'bg-white border-slate-200/90 hover:border-cyan-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => handleCheck(hw.id, hw.completed)}
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-cyan-600 transition active:scale-90"
                    title={hw.completed ? 'Görevi Tekrar Beklemeye Al' : 'Ödevi Tamamlandı İşaretle'}
                  >
                    {hw.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-cyan-500" />
                    )}
                  </button>

                  {/* Main Homework Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {/* Subject Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {hw.subject}
                      </span>

                      {/* Priority */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${priorityConf.badge}`}
                      >
                        {priorityConf.label}
                      </span>

                      {/* Due date */}
                      {hw.dueDate && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium ml-auto">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{hw.dueDate}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4
                      className={`text-sm font-bold leading-tight ${
                        hw.completed ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {hw.title}
                    </h4>

                    {/* Description */}
                    {hw.description && (
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          hw.completed ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {hw.description}
                      </p>
                    )}

                    {/* Extra Meta (Minutes, tags, notes) */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 flex-wrap">
                      {hw.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <Clock className="w-3 h-3 text-cyan-600" />
                          <span>{hw.estimatedMinutes} dakika</span>
                        </span>
                      )}

                      {hw.notes && (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-medium border border-amber-200 truncate max-w-[200px]">
                          Not: {hw.notes}
                        </span>
                      )}

                      {hw.tags &&
                        hw.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onOpenEditModal(hw)}
                      className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition"
                      title="Ödevi Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${hw.title}" ödevini silmek istediğinize emin misiniz?`)) {
                          onDeleteHomework(hw.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Ödevi Sil"
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

      {/* Quick Templates Bar */}
      <div className="mt-1 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-600 mb-2">
          <BookmarkPlus className="w-3.5 h-3.5 text-cyan-600" />
          <span>Hızlı Ödev Şablonları (Tek Tıkla Ekle):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => onAddQuickTemplate(dayId, template)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-left transition flex flex-col justify-between group active:scale-95"
            >
              <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">
                {template.subject}
              </span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#006473] truncate w-full mt-0.5">
                {template.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                ⏱ {template.minutes} dk
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
