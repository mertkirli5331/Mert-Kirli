import React from 'react';
import { WeekMenu, Homework, DayId } from '../types';
import { X, Printer, Calendar, Utensils, CheckSquare, GraduationCap } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekMenu: WeekMenu;
  homeworks: Homework[];
}

const dayList: { id: DayId; name: string }[] = [
  { id: 'mon', name: '1. Gün' },
  { id: 'tue', name: '2. Gün' },
  { id: 'wed', name: '3. Gün' },
  { id: 'thu', name: '4. Gün' },
  { id: 'fri', name: '5. Gün' },
];

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  weekMenu,
  homeworks,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cyan-950/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="no-print px-6 py-4 bg-[#004b57] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Haftalık Menü & Ödev Çıktısı (Yazdır / PDF)
              </h3>
              <p className="text-xs text-cyan-200">
                Mert Kirli — {weekMenu.weekNumber}. Hafta Planı
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-cyan-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 print:p-0 print:m-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#006473]" />
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  MERT KİRLİ OKUL PORTALI
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                30 Haftalık Okul Yemek Menüsü ve Günlük Ödev Takip Çizelgesi
              </p>
            </div>

            <div className="text-right">
              <span className="text-lg font-black text-[#006473] block">
                {weekMenu.weekNumber}. Hafta
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {weekMenu.semester}. Dönem • {weekMenu.theme}
              </span>
            </div>
          </div>

          {/* 5-Day Table Layout */}
          <div className="space-y-4">
            {dayList.map((day) => {
              const menu = weekMenu.days[day.id];
              const dayHw = homeworks.filter(
                (h) => h.weekNumber === weekMenu.weekNumber && h.dayId === day.id
              );

              return (
                <div
                  key={day.id}
                  className="border border-slate-300 rounded-xl p-3.5 break-inside-avoid"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 bg-slate-50 px-2 py-1 rounded-lg">
                    <span className="font-black text-slate-900 text-sm tracking-wide">
                      {day.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Öğle Kalori: {menu.calories} kcal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Menu Column */}
                    <div className="space-y-1">
                      <span className="font-bold text-[#006473] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <Utensils className="w-3.5 h-3.5" />
                        Günün Yemek Menüsü
                      </span>
                      <ul className="text-slate-700 space-y-0.5 pl-2 list-disc list-inside">
                        <li><strong>Çorba:</strong> {menu.soup}</li>
                        <li><strong>Ana Yemek:</strong> {menu.main}</li>
                        <li><strong>Yan Yemek:</strong> {menu.side}</li>
                        <li><strong>Salata / Tatlı:</strong> {menu.extra}</li>
                        <li><strong>İkindi:</strong> {menu.snack}</li>
                      </ul>
                    </div>

                    {/* Homework Column */}
                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200">
                      <span className="font-bold text-amber-800 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <CheckSquare className="w-3.5 h-3.5" />
                        Günün Ödevleri ({dayHw.length})
                      </span>
                      {dayHw.length === 0 ? (
                        <p className="text-slate-400 italic text-xs pl-2">
                          Ödev bulunmuyor / Serbest çalışma
                        </p>
                      ) : (
                        <ul className="text-slate-700 space-y-1 pl-1">
                          {dayHw.map((hw) => (
                            <li
                              key={hw.id}
                              className="flex items-start gap-1.5 text-xs"
                            >
                              <span className="w-3.5 h-3.5 border border-slate-400 rounded mt-0.5 inline-block flex-shrink-0"></span>
                              <div>
                                <span className="font-bold text-slate-900">
                                  [{hw.subject}] {hw.title}
                                </span>
                                {hw.dueDate && (
                                  <span className="text-[10px] text-slate-500 ml-1">
                                    ({hw.dueDate})
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Mert Kirli Kişisel Okul & Ödev Takip Sistemi</span>
            <span>Başarılar dileriz! 🎯</span>
          </div>
        </div>
      </div>
    </div>
  );
};
