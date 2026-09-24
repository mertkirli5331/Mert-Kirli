export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface DayMenu {
  dayId: DayId;
  dayName: string;
  soup: string;
  main: string;
  side: string;
  extra: string;
  snack: string;
  calories: number;
  allergens: string[];
}

export interface WeekMenu {
  weekNumber: number;
  semester: 1 | 2;
  theme: string;
  dateRange: string;
  days: Record<DayId, DayMenu>;
}

export type SubjectName =
  | 'Matematik'
  | 'Türkçe'
  | 'Fen Bilimleri'
  | 'Sosyal Bilgiler'
  | 'İngilizce'
  | 'Din Kültürü'
  | 'Bilişim'
  | 'Görsel Sanatlar'
  | 'Müzik'
  | 'Beden Eğitimi'
  | 'Rehberlik / Diğer';

export type Priority = 'low' | 'medium' | 'high';
export type HomeworkStatus = 'pending' | 'in_progress' | 'completed';

export interface Homework {
  id: string;
  weekNumber: number;
  dayId: DayId;
  subject: SubjectName | string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  estimatedMinutes?: number;
  notes?: string;
  tags?: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  schoolName: string;
  grade: string;
  studentNumber: string;
  streakDays: number;
  points: number;
}
