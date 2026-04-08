import { format, parse, addMinutes, isBefore, isAfter, isEqual, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import type { IWeeklySchedule, TimeSlot } from '@/types';

const DAY_INDEX_MAP: Record<number, string> = {
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
};

export function getDayName(date: Date): string {
  const dayIndex = date.getDay();
  return DAY_INDEX_MAP[dayIndex] || '';
}

export function generateTimeSlots(schedule: IWeeklySchedule): string[] {
  const slots: string[] = [];
  const baseDate = new Date(2024, 0, 1);
  const start = parse(schedule.startTime, 'HH:mm', baseDate);
  const end = parse(schedule.endTime, 'HH:mm', baseDate);
  let current = start;

  while (isBefore(current, end)) {
    const timeStr = format(current, 'HH:mm');

    const isInBreak = schedule.breaks?.some((b) => {
      const breakStart = parse(b.start, 'HH:mm', baseDate);
      const breakEnd = parse(b.end, 'HH:mm', baseDate);
      return (isAfter(current, breakStart) || isEqual(current, breakStart)) && isBefore(current, breakEnd);
    });

    if (!isInBreak) {
      slots.push(timeStr);
    }

    current = addMinutes(current, schedule.blockDuration);
  }

  return slots;
}

export function getAvailableSlots(
  schedule: IWeeklySchedule | undefined,
  bookedTimes: string[]
): TimeSlot[] {
  if (!schedule) return [];

  const allSlots = generateTimeSlots(schedule);
  return allSlots.map((time) => ({
    time,
    available: !bookedTimes.includes(time),
  }));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateValue(date) : date;
  return format(d, "EEEE d 'de' MMMM, yyyy", { locale: es });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateValue(date) : date;
  return format(d, 'dd/MM/yyyy');
}

export function toDateString(date: Date): string {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

function parseDateValue(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [yearRaw, monthRaw, dayRaw] = value.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    const day = Number(dayRaw);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  return new Date(value);
}
