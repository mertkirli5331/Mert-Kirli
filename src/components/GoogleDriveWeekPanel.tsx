import React, { useState, useEffect, useCallback, useId } from 'react';
import { WeekMenu, Homework, DriveFile, WeekDriveFolder } from '../types';
import {
  getOrCreateWeekFolder,
  listFilesForWeek,
  uploadFileToWeekFolder,
  createTextFileInWeekFolder,
  deleteFileFromDrive,
  signInWithGoogle,
  signOutGoogle,
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import {
  HardDrive,
  FolderOpen,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  ExternalLink,
  Trash2,
  RefreshCw,
  Plus,
  FileCheck,
  LogOut,
  AlertTriangle,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface GoogleDriveWeekPanelProps {
  currentWeek: number;
  weekMenu: WeekMenu;
  weekHomeworks: Homework[];
  currentUser: User | null;
  accessToken: string | null;
  onAuthSuccess: (user: User, token: string) => void;
  onSignOut: () => void;
  onToast: (msg: { text: string; type: 'success' | 'error' }) => void;
}

export const GoogleDriveWeekPanel: React.FC<GoogleDriveWeekPanelProps> = ({
  currentWeek,
  weekMenu,
  weekHomeworks,
  currentUser,
  accessToken,
  onAuthSuccess,
  onSignOut,
  onToast,
}) => {
  const [folder, setFolder] = useState<WeekDriveFolder | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // New Note Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Mandatory Delete Confirmation Modal state
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputId = useId();

  // Load or create week folder and list files
  const loadWeekData = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const wkFolder = await getOrCreateWeekFolder(
        accessToken,
        currentWeek,
        weekMenu.theme
      );
      setFolder(wkFolder);

      const fileList = await listFilesForWeek(accessToken, wkFolder.id);
      setFiles(fileList);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Drive verileri yüklenemedi.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentWeek, weekMenu.theme, onToast]);

  useEffect(() => {
    if (accessToken) {
      loadWeekData();
    } else {
      setFolder(null);
      setFiles([]);
    }
  }, [accessToken, currentWeek, loadWeekData]);

  // Handle Login
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        onAuthSuccess(result.user, result.accessToken);
        onToast({
          text: `Google Drive bağlandı: ${result.user.displayName || result.user.email}`,
          type: 'success',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Giriş yapılamadı.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOutGoogle();
      onSignOut();
      onToast({ text: 'Google Drive oturumu kapatıldı.', type: 'success' });
    } catch {
      onToast({ text: 'Çıkış yapılırken bir hata oluştu.', type: 'error' });
    }
  };

  // Handle File Upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken || !folder) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFileToWeekFolder(accessToken, folder.id, file);
      setFiles((prev) => [uploaded, ...prev]);
      onToast({
        text: `"${file.name}" ${currentWeek}. Hafta Drive klasörüne yüklendi!`,
        type: 'success',
      });
      // Clear input
      e.target.value = '';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Dosya yükleme başarısız.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Save Week Summary to Drive
  const handleExportWeekSummary = async () => {
    if (!accessToken || !folder) return;

    setIsUploading(true);
    try {
      const dateStr = new Date().toLocaleDateString('tr-TR');
      let text = `========================================================\n`;
      text += `MERT KİRLİ OKUL PORTALI - ${currentWeek}. HAFTA ÇİZELGESİ\n`;
      text += `Tema: ${weekMenu.theme} | Dönem: ${weekMenu.semester}. Dönem\n`;
      text += `Oluşturulma Tarihi: ${dateStr}\n`;
      text += `========================================================\n\n`;

      text += `--- 5 GÜNLÜK YEMEK MENÜSÜ ---\n`;
      const days = [
        { id: 'mon' as const, name: '1. Gün (Pazartesi)' },
        { id: 'tue' as const, name: '2. Gün (Salı)' },
        { id: 'wed' as const, name: '3. Gün (Çarşamba)' },
        { id: 'thu' as const, name: '4. Gün (Perşembe)' },
        { id: 'fri' as const, name: '5. Gün (Cuma)' },
      ];

      days.forEach(({ id, name }) => {
        const m = weekMenu.days[id];
        text += `\n[${name}]\n`;
        text += `  • Çorba: ${m.soup}\n`;
        text += `  • Ana Yemek: ${m.main}\n`;
        text += `  • Yan Yemek: ${m.side}\n`;
        text += `  • Ek / Tatlı / Meyve: ${m.extra}\n`;
        text += `  • İkindi Ara Öğün: ${m.snack}\n`;
        text += `  • Toplam Kalori: ${m.calories} kcal\n`;
      });

      text += `\n\n--- BU HAFTANIN ÖDEVLERİ (${weekHomeworks.length} Görev) ---\n`;
      if (weekHomeworks.length === 0) {
        text += `Bu hafta için henüz eklenmiş ödev bulunmamaktadır.\n`;
      } else {
        weekHomeworks.forEach((hw, idx) => {
          text += `\n${idx + 1}. [${hw.subject}] ${hw.title} ${hw.completed ? '(TAMAMLANDI)' : '(BEKLİYOR)'}\n`;
          text += `   Açıklama: ${hw.description || 'Açıklama yok'}\n`;
          text += `   Son Tarih: ${hw.dueDate || 'Belirtilmedi'} | Öncelik: ${hw.priority}\n`;
        });
      }

      const fileName = `Hafta_${currentWeek.toString().padStart(2, '0')}_Menu_ve_Odevler`;
      const created = await createTextFileInWeekFolder(
        accessToken,
        folder.id,
        fileName,
        text
      );

      setFiles((prev) => [created, ...prev.filter((f) => f.id !== created.id)]);
      onToast({
        text: `${currentWeek}. Hafta planı Google Drive'a başarıyla kaydedildi!`,
        type: 'success',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Yedekleme başarısız.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Create Quick Note in Drive
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !accessToken || !folder) return;

    setIsSavingNote(true);
    try {
      const created = await createTextFileInWeekFolder(
        accessToken,
        folder.id,
        noteTitle.trim(),
        noteContent
      );
      setFiles((prev) => [created, ...prev]);
      setNoteTitle('');
      setNoteContent('');
      setIsNoteModalOpen(false);
      onToast({
        text: `"${noteTitle}" ders notu Google Drive'a kaydedildi.`,
        type: 'success',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Not kaydedilemedi.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsSavingNote(false);
    }
  };

  // Confirm and Execute Deletion (Workspace API Destructive Operation Requirement)
  const handleConfirmDelete = async () => {
    if (!fileToDelete || !accessToken) return;

    setIsDeleting(true);
    try {
      await deleteFileFromDrive(accessToken, fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      onToast({
        text: `"${fileToDelete.name}" Google Drive'dan silindi.`,
        type: 'success',
      });
      setFileToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Dosya silinemedi.';
      onToast({ text: message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (mimeType.includes('image')) {
      return <FileImage className="w-5 h-5 text-purple-500" />;
    }
    if (mimeType.includes('sheet') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    if (mimeType.includes('text') || mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '';
    const b = parseInt(bytes, 10);
    if (isNaN(b) || b === 0) return '';
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Not Logged In View
  if (!currentUser || !accessToken) {
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-cyan-950/20 border border-cyan-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-[#006473] to-[#088395] flex items-center justify-center text-white shadow-lg mb-4">
          <HardDrive className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full mb-2">
          {currentWeek}. Hafta Google Drive Entegrasyonu
        </span>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight max-w-md">
          {currentWeek}. Haftaya Google Drive ile Ders & Ödev Dosyası Ekleyin
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mt-2 mb-6">
          Google hesabınızı bağlayarak {currentWeek}. Hafta için otomatik bulut klasörü
          oluşturabilir; PDF ders notları, öğretmen çalışma kağıtları ve haftalık yemek
          menü çizelgenizi Drive hesabınızda düzenli bir şekilde saklayabilirsiniz.
        </p>

        {/* Official-Styled Sign in with Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border-2 border-slate-200 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
          ) : (
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          )}
          <span>
            {isLoggingIn ? 'Google Drive Bağlanıyor...' : 'Google ile Giriş Yap & Drive’ı Bağla'}
          </span>
        </button>

        <p className="text-[11px] text-slate-400 mt-4">
          Yalnızca Mert Kirli Okul Portalı tarafından oluşturulan ve seçtiğiniz okul dosyalarına erişilir.
        </p>
      </div>
    );
  }

  // Connected View
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-cyan-950/20 border border-cyan-100 flex flex-col gap-5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#006473] text-white flex items-center justify-center shadow-md">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentWeek}. Hafta Google Drive Arşivi
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Bağlı
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Klasör: <span className="font-bold text-[#006473]">Mert Kirli - Okul Portalı / Hafta {currentWeek.toString().padStart(2, '0')}</span>
            </p>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || ''}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.displayName ? currentUser.displayName[0] : 'U'}
              </div>
            )}
            <span className="font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-[160px]">
              {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-red-600 transition ml-1"
              title="Drive Oturumunu Kapat"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={loadWeekData}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition disabled:opacity-50"
            title="Dosyaları Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Open in Drive Button */}
        {folder?.webViewLink ? (
          <a
            href={folder.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-[#006473] font-bold text-xs transition active:scale-98"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Drive Klasörünü Aç</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
          </a>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Klasör Hazırlanıyor...</span>
          </button>
        )}

        {/* Upload File Button */}
        <label
          htmlFor={fileInputId}
          className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-xs transition cursor-pointer active:scale-98 ${
            isUploading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#006473] hover:bg-[#00515e] text-white shadow-sm'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          <span>{isUploading ? 'Yükleniyor...' : 'Bu Haftaya Dosya Yükle'}</span>
          <input
            id={fileInputId}
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading || !folder}
            className="hidden"
          />
        </label>

        {/* Export Week Summary Button */}
        <button
          onClick={handleExportWeekSummary}
          disabled={isUploading || !folder}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition active:scale-98 disabled:opacity-50"
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Haftalık Planı Drive'a Kaydet</span>
        </button>
      </div>

      {/* Files Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {currentWeek}. Hafta Dosyaları
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {files.length} dosya
            </span>
          </div>

          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#006473] hover:text-cyan-800 p-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Ders Notu Yaz</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#006473]" />
            <span className="text-xs font-medium">Google Drive dosyaları getiriliyor...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="py-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <HardDrive className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {currentWeek}. Hafta klasöründe henüz dosya yok
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mt-0.5 mb-3">
              Yukarıdaki "Bu Haftaya Dosya Yükle" veya "Haftalık Planı Drive'a Kaydet" butonlarıyla dosya ekleyebilirsiniz.
            </p>
            <button
              onClick={handleExportWeekSummary}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentWeek}. Hafta Planını Drive'a Yedekle</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-300 bg-white hover:bg-cyan-50/30 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 shrink-0">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-xs font-bold text-slate-900 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.createdTime && (
                        <span>
                          {new Date(file.createdTime).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-[#006473] hover:bg-cyan-100 rounded-lg transition"
                      title="Google Drive'da Aç"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Mandatory Explicit User Confirmation Delete Trigger */}
                  <button
                    onClick={() => setFileToDelete(file)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Dosyayı Google Drive'dan Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyan-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-cyan-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#006473]" />
                <h4 className="font-black text-slate-900 text-sm sm:text-base">
                  {currentWeek}. Hafta İçin Ders Notu Oluştur
                </h4>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Not Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Matematik Kesirler Ders Notu"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Not İçeriği
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Bu haftanın ders veya ödev notlarını buraya yazın..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 font-medium resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSavingNote}
                  className="flex-1 py-2 rounded-xl bg-[#006473] text-white font-bold text-xs hover:bg-[#004d59] transition flex items-center justify-center gap-1.5"
                >
                  {isSavingNote ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{isSavingNote ? 'Kaydediliyor...' : 'Drive’a Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY EXPLICIT USER CONFIRMATION DIALOG FOR DESTRUCTIVE GOOGLE DRIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-red-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">
                  Google Drive Dosyasını Sil
                </h4>
                <p className="text-xs text-slate-500">
                  Bu işlem kullanıcının Google Drive'ındaki dosyayı kaldıracaktır.
                </p>
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-xs font-semibold text-red-900">
                <span className="font-bold underline">{fileToDelete.name}</span> adlı dosyayı Google Drive'ınızdan kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              <p className="text-[11px] text-red-700 mt-1">
                Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Vazgeç / İptal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{isDeleting ? 'Siliniyor...' : 'Evet, Dosyayı Sil'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
