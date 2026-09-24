import React, { useState } from 'react';
import { DayMenu } from '../types';
import {
  Utensils,
  Soup,
  Drumstick,
  Apple,
  Flame,
  AlertCircle,
  Coffee,
  Edit2,
  Check,
  Droplets,
  Sparkles
} from 'lucide-react';

interface DailyMenuCardProps {
  dayMenu: DayMenu;
  weekNumber: number;
  onUpdateMenu: (updated: DayMenu) => void;
}

export const DailyMenuCard: React.FC<DailyMenuCardProps> = ({
  dayMenu,
  weekNumber,
  onUpdateMenu,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSoup, setEditSoup] = useState(dayMenu.soup);
  const [editMain, setEditMain] = useState(dayMenu.main);
  const [editSide, setEditSide] = useState(dayMenu.side);
  const [editExtra, setEditExtra] = useState(dayMenu.extra);
  const [editSnack, setEditSnack] = useState(dayMenu.snack);
  const [editCalories, setEditCalories] = useState(dayMenu.calories);

  const handleSave = () => {
    onUpdateMenu({
      ...dayMenu,
      soup: editSoup,
      main: editMain,
      side: editSide,
      extra: editExtra,
      snack: editSnack,
      calories: Number(editCalories) || 720,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-cyan-950/20 border border-cyan-100 relative overflow-hidden transition-all">
      {/* Top decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400"></div>

      {/* Header of Menu Card */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center shadow-inner">
            <Utensils className="w-5 h-5 text-[#006473]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {dayMenu.dayName} Yemek Menüsü
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                {weekNumber}. Hafta
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Mert Kirli Okul Kafeteryası Öğle & İkindi Öğünü
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Calorie Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{dayMenu.calories} kcal</span>
          </div>

          {/* Edit menu toggle */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setEditSoup(dayMenu.soup);
                setEditMain(dayMenu.main);
                setEditSide(dayMenu.side);
                setEditExtra(dayMenu.extra);
                setEditSnack(dayMenu.snack);
                setEditCalories(dayMenu.calories);
                setIsEditing(true);
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 transition border border-slate-200"
            title={isEditing ? 'Değişiklikleri Kaydet' : 'Menüyü Düzenle'}
          >
            {isEditing ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Edit2 className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Dishes Grid */}
      {isEditing ? (
        <div className="space-y-3 bg-cyan-50/50 p-3.5 rounded-2xl border border-cyan-200 text-xs">
          <p className="font-bold text-cyan-900 mb-1">Menüyü Kişiselleştir:</p>
          <div>
            <label className="text-slate-600 block mb-0.5 font-medium">1. Çorba:</label>
            <input
              type="text"
              value={editSoup}
              onChange={(e) => setEditSoup(e.target.value)}
              className="w-full bg-white border border-cyan-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-0.5 font-medium">2. Ana Yemek:</label>
            <input
              type="text"
              value={editMain}
              onChange={(e) => setEditMain(e.target.value)}
              className="w-full bg-white border border-cyan-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-0.5 font-medium">3. Yan Yemek / Garnitür:</label>
            <input
              type="text"
              value={editSide}
              onChange={(e) => setEditSide(e.target.value)}
              className="w-full bg-white border border-cyan-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-0.5 font-medium">4. Salata / Tatlı / Meyve:</label>
            <input
              type="text"
              value={editExtra}
              onChange={(e) => setEditExtra(e.target.value)}
              className="w-full bg-white border border-cyan-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 block mb-0.5 font-medium">5. İkindi Ara Öğünü:</label>
            <input
              type="text"
              value={editSnack}
              onChange={(e) => setEditSnack(e.target.value)}
              className="w-full bg-white border border-cyan-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#006473] text-white font-bold hover:bg-[#00515e]"
            >
              Kaydet
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Soup */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100/90 group hover:border-amber-300 transition">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Soup className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Başlangıç Çorbası
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                {dayMenu.soup}
              </p>
            </div>
          </div>

          {/* Main Dish */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/90 group hover:border-cyan-400 transition">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0">
              <Drumstick className="w-4 h-4 text-[#006473]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#006473] uppercase tracking-wider block">
                Ana Yemek (Protein)
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                {dayMenu.main}
              </p>
            </div>
          </div>

          {/* Side Dish */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 group hover:border-emerald-300 transition">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Garnitür & Pilav / Makarna
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                {dayMenu.side}
              </p>
            </div>
          </div>

          {/* Extra / Salad / Dessert */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-100/90 group hover:border-rose-300 transition">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <Apple className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Salata / Tatlı / İçecek
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                {dayMenu.extra}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Afternoon Snack & Hydration Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Coffee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-semibold text-slate-600">İkindi Ara Öğünü:</span>
          <span className="font-medium text-slate-800 truncate">{dayMenu.snack}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-cyan-800 font-medium bg-cyan-50/80 px-2.5 py-1 rounded-xl border border-cyan-100">
          <Droplets className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
          <span>Günde en az 8 bardak su içmeyi unutma!</span>
        </div>
      </div>

      {/* Allergens warning */}
      {dayMenu.allergens.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
          <AlertCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>Alerjen Bilgisi:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {dayMenu.allergens.map((alg) => (
              <span
                key={alg}
                className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium"
              >
                {alg}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
