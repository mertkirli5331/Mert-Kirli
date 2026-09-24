import React, { useState } from 'react';
import { UserProfile, Homework } from '../types';
import {
  X,
  User,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  School,
  Save
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  homeworks: Homework[];
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  homeworks,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [schoolName, setSchoolName] = useState(userProfile.schoolName);
  const [grade, setGrade] = useState(userProfile.grade);
  const [studentNumber, setStudentNumber] = useState(userProfile.studentNumber);

  if (!isOpen) return null;

  const totalHw = homeworks.length;
  const completedHw = homeworks.filter((h) => h.completed).length;
  const completionRate = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0;

  const handleSave = () => {
    onUpdateProfile({
      ...userProfile,
      name,
      schoolName,
      grade,
      studentNumber,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cyan-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-cyan-100 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Profile Card Header */}
        <div className="p-6 bg-gradient-to-br from-[#004b57] via-[#006473] to-[#088395] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-cyan-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-300 to-white p-0.5 shadow-xl">
              <div className="w-full h-full bg-[#003842] rounded-[14px] flex items-center justify-center text-cyan-200 font-black text-xl">
                MK
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">{userProfile.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-300 text-cyan-950">
                  Öğrenci
                </span>
              </div>
              <p className="text-xs text-cyan-200/90 font-medium mt-0.5">
                Mert Kirli Web Sitesi & Kişisel Okul Portalı
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-400/20">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {userProfile.streakDays} Gün Seri
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-400/20">
                  <Award className="w-3.5 h-3.5" />
                  {userProfile.points} Puan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-cyan-50/70 p-3 rounded-2xl border border-cyan-200/70 text-center">
              <span className="text-[10px] font-bold text-cyan-800 uppercase block">
                Toplam Ödev
              </span>
              <span className="text-lg font-black text-[#006473]">{totalHw}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Biten Ödev
              </span>
              <span className="text-lg font-black text-emerald-700">{completedHw}</span>
            </div>
            <div className="bg-teal-50 p-3 rounded-2xl border border-teal-200 text-center">
              <span className="text-[10px] font-bold text-teal-800 uppercase block">
                Başarı Oranı
              </span>
              <span className="text-lg font-black text-teal-700">%{completionRate}</span>
            </div>
          </div>

          {/* Student Info Details or Edit Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <School className="w-3.5 h-3.5 text-[#006473]" />
                Öğrenci & Okul Bilgileri
              </span>
              <button
                onClick={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
                className="text-xs font-bold text-[#006473] hover:underline"
              >
                {isEditing ? 'Kaydet' : 'Düzenle'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <label className="block text-slate-600 mb-0.5">İsim:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Okul:</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Sınıf:</label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Öğrenci No:</label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span>Öğrenci:</span>
                  <strong className="text-slate-900">{userProfile.name}</strong>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span>Okul:</span>
                  <span className="text-slate-800">{userProfile.schoolName}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span>Sınıf / Şube:</span>
                  <span className="text-slate-800">{userProfile.grade}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span>Numara:</span>
                  <span className="text-slate-800 font-mono font-bold">
                    {userProfile.studentNumber}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Backup / Restore & Reset Controls */}
          <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block mb-1">
              Veri & Yedekleme İşlemleri:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportData}
                className="flex items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Yedek İndir (JSON)</span>
              </button>

              <label className="flex items-center justify-center gap-1 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Yedek Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => {
                if (
                  confirm(
                    'Tüm ödev ve menü verilerini ilk haline sıfırlamak istiyor musunuz?'
                  )
                ) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-1 p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-bold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılan Verilere Sıfırla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
