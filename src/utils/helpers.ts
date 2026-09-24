import { SubjectName, Priority } from '../types';

export const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Matematik: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  Türkçe: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  'Fen Bilimleri': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Sosyal Bilgiler': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  İngilizce: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  'Din Kültürü': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  Bilişim: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  'Görsel Sanatlar': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
  Müzik: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  'Beden Eğitimi': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  'Rehberlik / Diğer': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
};

export function getSubjectStyle(subject: string) {
  return (
    SUBJECT_COLORS[subject] || {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200',
      dot: 'bg-cyan-600',
    }
  );
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string }> = {
  low: { label: 'Düşük', badge: 'bg-slate-100 text-slate-600 border border-slate-200' },
  medium: { label: 'Normal', badge: 'bg-amber-100 text-amber-800 border border-amber-300' },
  high: { label: 'Öncelikli!', badge: 'bg-red-100 text-red-700 font-bold border border-red-300 animate-pulse' },
};

export function playCompletionSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  } catch {
    // Silently ignore if audio is blocked or unavailable
  }
}
