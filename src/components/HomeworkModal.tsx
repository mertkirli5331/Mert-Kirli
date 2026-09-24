import React, { useState, useEffect } from 'react';
import { Homework, DayId, SubjectName, Priority } from '../types';
import { X, BookOpen, Calendar, Clock, AlertTriangle, FileText, Check } from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (homeworkData: Omit<Homework, 'id' | 'completed'> & { id?: string }) => void;
  initialWeek: number;
  initialDay: DayId;
  editingHomework?: Homework | null;
}

const subjects: SubjectName[] = [
  'Matematik',
  'Türkçe',
  'Fen Bilimleri',
  'Sosyal Bilgiler',
  'İngilizce',
  'Din Kültürü',
  'Bilişim',
  'Görsel Sanatlar',
  'Müzik',
  'Beden Eğitimi',
  'Rehberlik / Diğer',
];

const dayOptions: { id: DayId; label: string }[] = [
  { id: 'mon', label: '1. Gün' },
  { id: 'tue', label: '2. Gün' },
  { id: 'wed', label: '3. Gün' },
  { id: 'thu', label: '4. Gün' },
  { id: 'fri', label: '5. Gün' },
];

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialWeek,
  initialDay,
  editingHomework,
}) => {
  const [subject, setSubject] = useState<string>('Matematik');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weekNumber, setWeekNumber] = useState<number>(initialWeek);
  const [dayId, setDayId] = useState<DayId>(initialDay);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingHomework) {
      setSubject(editingHomework.subject);
      setTitle(editingHomework.title);
      setDescription(editingHomework.description || '');
      setWeekNumber(editingHomework.weekNumber);
      setDayId(editingHomework.dayId);
      setDueDate(editingHomework.dueDate || '');
      setPriority(editingHomework.priority);
      setEstimatedMinutes(editingHomework.estimatedMinutes || 30);
      setNotes(editingHomework.notes || '');
    } else {
      setSubject('Matematik');
      setTitle('');
      setDescription('');
      setWeekNumber(initialWeek);
      setDayId(initialDay);
      setDueDate('');
      setPriority('medium');
      setEstimatedMinutes(30);
      setNotes('');
    }
  }, [editingHomework, initialWeek, initialDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: editingHomework?.id,
      weekNumber,
      dayId,
      subject,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.trim() || undefined,
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyan-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-cyan-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004b57] to-[#006473] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center text-cyan-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                {editingHomework ? 'Ödevi Düzenle' : 'Yeni Ödev Ekle'}
              </h3>
              <p className="text-xs text-cyan-200">
                Mert Kirli Günlük Ödev Yönetim Paneli
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Week & Day Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hafta Seçimi
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    {w}. Hafta {w <= 15 ? '(1. Dönem)' : '(2. Dönem)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gün Seçimi
              </label>
              <select
                value={dayId}
                onChange={(e) => setDayId(e.target.value as DayId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                {dayOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ders
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
              {subjects.map((sub) => {
                const isSelected = subject === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-2 py-1.5 text-xs rounded-lg font-bold truncate transition text-center ${
                      isSelected
                        ? 'bg-[#006473] text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-cyan-50 border border-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ödev Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Sayfa 42-44 Alıştırmalar, Test 5 Çözülecek"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Açıklama / Detaylar
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ödev ile ilgili ayrıntılar, hangi sorular çözülecek..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Priority & Estimated Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Öncelik
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                  const labels = { low: 'Düşük', medium: 'Normal', high: 'Acil' };
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                        isSelected
                          ? p === 'high'
                            ? 'bg-red-500 text-white border-red-500'
                            : p === 'medium'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-slate-700 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahmini Süre (Dakika)
              </label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Due date / Reminder text */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teslim Zamanı / Hatırlatıcı
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Örn: Yarın 08:30"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Özel Not / Materyal
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Renkli kalemler gerekli"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#006473] to-[#088395] hover:from-[#004f5b] hover:to-[#006473] text-white font-black shadow-md shadow-cyan-950/20 active:scale-95 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingHomework ? 'Güncelle' : 'Ödevi Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
