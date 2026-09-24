import React, { useState, useEffect } from 'react';
import { initial30WeeksMenu } from './data/menuData';
import { initialHomeworkList, defaultStudentProfile } from './data/homeworkData';
import { WeekMenu, Homework, DayId, UserProfile } from './types';
import { Header } from './components/Header';
import { WeekBar } from './components/WeekBar';
import { DayTabs } from './components/DayTabs';
import { DailyMenuCard } from './components/DailyMenuCard';
import { HomeworkTracker } from './components/HomeworkTracker';
import { HomeworkModal } from './components/HomeworkModal';
import { WeeksGridModal } from './components/WeeksGridModal';
import { PrintModal } from './components/PrintModal';
import { ProfileModal } from './components/ProfileModal';
import { AllHomeworksView } from './components/AllHomeworksView';
import { MobileBottomNav, ActiveTab } from './components/MobileBottomNav';
import { MobileFrame } from './components/MobileFrame';
import {
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  ListTodo,
  Utensils,
  Share2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

const STORAGE_KEYS = {
  WEEKS: 'mert_kirli_weeks_menu_v2',
  HOMEWORKS: 'mert_kirli_homeworks_v2',
  PROFILE: 'mert_kirli_profile_v1',
  LAST_WEEK: 'mert_kirli_selected_week',
};

const normalizeDayNames = (loadedWeeks: WeekMenu[]): WeekMenu[] => {
  const genericLabels: Record<DayId, string> = {
    mon: '1. Gün',
    tue: '2. Gün',
    wed: '3. Gün',
    thu: '4. Gün',
    fri: '5. Gün',
  };
  return loadedWeeks.map((week) => ({
    ...week,
    days: {
      mon: { ...week.days.mon, dayName: genericLabels.mon },
      tue: { ...week.days.tue, dayName: genericLabels.tue },
      wed: { ...week.days.wed, dayName: genericLabels.wed },
      thu: { ...week.days.thu, dayName: genericLabels.thu },
      fri: { ...week.days.fri, dayName: genericLabels.fri },
    },
  }));
};

export default function App() {
  // State for 30 Weeks Menu
  const [weeks, setWeeks] = useState<WeekMenu[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEEKS) || localStorage.getItem('mert_kirli_weeks_menu_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizeDayNames(parsed);
      }
      return initial30WeeksMenu;
    } catch {
      return initial30WeeksMenu;
    }
  });

  // State for Homeworks
  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMEWORKS);
      return saved ? JSON.parse(saved) : initialHomeworkList;
    } catch {
      return initialHomeworkList;
    }
  });

  // State for Student Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : defaultStudentProfile;
    } catch {
      return defaultStudentProfile;
    }
  });

  // Active navigation selections
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_WEEK);
      const parsed = Number(saved);
      return parsed >= 1 && parsed <= 30 ? parsed : 1;
    } catch {
      return 1;
    }
  });

  const [selectedDay, setSelectedDay] = useState<DayId>('mon');
  const [activeTab, setActiveTab] = useState<ActiveTab>('day-view');
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [modalTargetDay, setModalTargetDay] = useState<DayId>('mon');

  const [isWeeksGridOpen, setIsWeeksGridOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(weeks));
  }, [weeks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOMEWORKS, JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_WEEK, String(selectedWeek));
  }, [selectedWeek]);

  // Current active week data
  const currentWeekMenu = weeks.find((w) => w.weekNumber === selectedWeek) || weeks[0];
  const currentDayMenu = currentWeekMenu.days[selectedDay];

  // Homeworks partitioned
  const weekHomeworks = homeworks.filter((h) => h.weekNumber === selectedWeek);
  const dayHomeworks = weekHomeworks.filter((h) => h.dayId === selectedDay);

  const dayHomeworksMap: Record<DayId, Homework[]> = {
    mon: weekHomeworks.filter((h) => h.dayId === 'mon'),
    tue: weekHomeworks.filter((h) => h.dayId === 'tue'),
    wed: weekHomeworks.filter((h) => h.dayId === 'wed'),
    thu: weekHomeworks.filter((h) => h.dayId === 'thu'),
    fri: weekHomeworks.filter((h) => h.dayId === 'fri'),
  };

  const totalTasksCount = homeworks.length;
  const completedTasksCount = homeworks.filter((h) => h.completed).length;
  const pendingWeekCount = weekHomeworks.filter((h) => !h.completed).length;

  // Handlers for Homework
  const handleToggleComplete = (id: string) => {
    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id === id) {
          const nextCompleted = !hw.completed;
          return {
            ...hw,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return hw;
      })
    );

    // Increase points on completion
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 15,
    }));
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworks((prev) => prev.filter((hw) => hw.id !== id));
  };

  const handleSaveHomework = (
    data: Omit<Homework, 'id' | 'completed'> & { id?: string }
  ) => {
    if (data.id) {
      // Edit existing
      setHomeworks((prev) =>
        prev.map((h) => (h.id === data.id ? { ...h, ...data } : h))
      );
    } else {
      // Create new
      const newHw: Homework = {
        ...data,
        id: `hw-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        completed: false,
      };
      setHomeworks((prev) => [newHw, ...prev]);
    }
  };

  const handleAddQuickTemplate = (
    day: DayId,
    template: { title: string; subject: string; minutes: number }
  ) => {
    const newHw: Homework = {
      id: `hw-quick-${Date.now()}`,
      weekNumber: selectedWeek,
      dayId: day,
      subject: template.subject,
      title: template.title,
      description: `${template.subject} dersi için günlük çalışma görevi.`,
      dueDate: 'Günün Sonu',
      priority: 'medium',
      completed: false,
      estimatedMinutes: template.minutes,
    };
    setHomeworks((prev) => [newHw, ...prev]);
  };

  const handleOpenAddModal = (day: DayId) => {
    setEditingHomework(null);
    setModalTargetDay(day);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (hw: Homework) => {
    setEditingHomework(hw);
    setModalTargetDay(hw.dayId);
    setIsAddModalOpen(true);
  };

  // Handler for Menu update
  const handleUpdateMenu = (updatedDayMenu: typeof currentDayMenu) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.weekNumber === selectedWeek) {
          return {
            ...w,
            days: {
              ...w.days,
              [selectedDay]: updatedDayMenu,
            },
          };
        }
        return w;
      })
    );
  };

  // Reset & Export/Import
  const handleResetData = () => {
    setWeeks(initial30WeeksMenu);
    setHomeworks(initialHomeworkList);
    setUserProfile(defaultStudentProfile);
    localStorage.removeItem(STORAGE_KEYS.WEEKS);
    localStorage.removeItem(STORAGE_KEYS.HOMEWORKS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  };

  const handleExportData = () => {
    const payload = {
      weeks,
      homeworks,
      userProfile,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mert_kirli_okul_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.weeks && parsed.homeworks) {
          setWeeks(parsed.weeks);
          setHomeworks(parsed.homeworks);
          if (parsed.userProfile) setUserProfile(parsed.userProfile);
          alert('Veriler başarıyla yüklendi!');
        }
      } catch {
        alert('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
  };

  const mainContent = (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-b from-[#00515e] via-[#004752] to-[#003842] text-slate-100">
      {/* App Top Header */}
      <Header
        currentWeek={selectedWeek}
        totalWeeks={30}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
        userProfile={userProfile}
        isMobileView={isMobileSimulated}
        onToggleMobileView={() => setIsMobileSimulated(!isMobileSimulated)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenWeeksGrid={() => setIsWeeksGridOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
      />

      {/* 30-Week Horizontal Carousel / Bar */}
      <WeekBar
        weeks={weeks}
        selectedWeek={selectedWeek}
        onSelectWeek={(w) => {
          setSelectedWeek(w);
          if (activeTab === 'weeks-grid') setActiveTab('day-view');
        }}
        homeworks={homeworks}
        onOpenWeeksGrid={() => setIsWeeksGridOpen(true)}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        {/* Desktop View Switcher Pills */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#003c46] p-1.5 rounded-2xl border border-cyan-400/20 text-xs font-bold">
            <button
              onClick={() => setActiveTab('day-view')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'day-view'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-950 shadow-md font-black'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Günlük Menü & Ödevler</span>
            </button>

            <button
              onClick={() => setActiveTab('all-homeworks')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition relative ${
                activeTab === 'all-homeworks'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-cyan-950 shadow-md font-black'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Tüm Ödevler Listesi</span>
              {pendingWeekCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[10px]">
                  {pendingWeekCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick info banner */}
          <div className="flex items-center gap-2 text-xs text-cyan-200 bg-[#003c46]/70 px-3.5 py-2 rounded-2xl border border-cyan-400/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>
              <strong>Mert Kirli:</strong> {selectedWeek}. Hafta / {currentDayMenu.dayName}
            </span>
          </div>
        </div>

        {/* Dynamic Content Views */}
        {activeTab === 'day-view' ? (
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* 5 Günlük Okul Sekmeleri (1. Gün - 5. Gün) */}
            <DayTabs
              daysMenu={currentWeekMenu.days}
              selectedDay={selectedDay}
              onSelectDay={(d) => setSelectedDay(d)}
              dayHomeworks={dayHomeworksMap}
            />

            {/* Split Grid: Daily Menu (Left) + Daily Homeworks (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Daily Lunch Menu Card */}
              <div className="lg:col-span-5">
                <DailyMenuCard
                  dayMenu={currentDayMenu}
                  weekNumber={selectedWeek}
                  onUpdateMenu={handleUpdateMenu}
                />
              </div>

              {/* Daily Homework Tracker Card */}
              <div className="lg:col-span-7">
                <HomeworkTracker
                  dayId={selectedDay}
                  dayMenu={currentDayMenu}
                  weekNumber={selectedWeek}
                  homeworks={dayHomeworks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteHomework={handleDeleteHomework}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                  onAddQuickTemplate={handleAddQuickTemplate}
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'all-homeworks' ? (
          <AllHomeworksView
            homeworks={homeworks}
            currentWeek={selectedWeek}
            onToggleComplete={handleToggleComplete}
            onDeleteHomework={handleDeleteHomework}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onSelectWeek={(w) => setSelectedWeek(w)}
          />
        ) : null}

        {/* Motivational Banner / Mert Kirli Footer Note */}
        <footer className="mt-6 mb-16 sm:mb-4 py-4 px-5 rounded-3xl bg-[#003842]/80 border border-cyan-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cyan-200/90">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-white">Mert Kirli Web Sitesi</span>
            <span className="text-cyan-400/60">•</span>
            <span>30 Haftalık Okul Menüsü & Günlük Ödev Takip Portalı</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWeeksGridOpen(true)}
              className="text-cyan-300 hover:text-white underline font-semibold"
            >
              Hafta Seçici
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="text-cyan-300 hover:text-white underline font-semibold"
            >
              Yazdır / PDF
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-cyan-300 hover:text-white underline font-semibold"
            >
              Öğrenci Profili
            </button>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar (Phone Screen Only) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'weeks-grid') {
            setIsWeeksGridOpen(true);
          } else if (tab === 'profile') {
            setIsProfileModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        pendingHomeworkCount={pendingWeekCount}
      />

      {/* Add / Edit Homework Modal */}
      <HomeworkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveHomework}
        initialWeek={selectedWeek}
        initialDay={modalTargetDay}
        editingHomework={editingHomework}
      />

      {/* 30-Weeks Grid Overview Modal */}
      <WeeksGridModal
        isOpen={isWeeksGridOpen}
        onClose={() => setIsWeeksGridOpen(false)}
        weeks={weeks}
        selectedWeek={selectedWeek}
        onSelectWeek={(w) => setSelectedWeek(w)}
        homeworks={homeworks}
      />

      {/* Print / PDF Weekly Planner Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        weekMenu={currentWeekMenu}
        homeworks={homeworks}
      />

      {/* Mert Kirli Profile & Backup Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(p) => setUserProfile(p)}
        homeworks={homeworks}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
    </div>
  );

  return (
    <MobileFrame isSimulated={isMobileSimulated}>
      {mainContent}
    </MobileFrame>
  );
}
