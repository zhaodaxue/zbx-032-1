import { FlowerArrival } from '@/data/types';

export const calculateRemainingDays = (arrival: FlowerArrival): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrivalDate = new Date(arrival.arrivalDate);
  arrivalDate.setHours(0, 0, 0, 0);
  const daysSinceArrival = Math.floor(
    (today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceArrival < 0) {
    return arrival.freshDays;
  }
  return Math.max(0, arrival.freshDays - daysSinceArrival);
};

export const hasArrived = (arrival: FlowerArrival): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrivalDate = new Date(arrival.arrivalDate);
  arrivalDate.setHours(0, 0, 0, 0);
  return arrivalDate.getTime() <= today.getTime();
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  return `${year}年${month}月${day}日 ${weekDay}`;
};

export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  return `${month}/${day} ${weekDay}`;
};

export const getWeekRange = (
  refDate: Date = new Date()
): { start: Date; end: Date; label: string } => {
  const date = new Date(refDate);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const format = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  const label = `${format(start)} - ${format(end)}`;

  return { start, end, label };
};

export const isDateInRange = (
  dateStr: string,
  start: Date,
  end: Date
): boolean => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const rangeStart = new Date(start);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(end);
  rangeEnd.setHours(23, 59, 59, 999);
  return date.getTime() >= rangeStart.getTime() && date.getTime() <= rangeEnd.getTime();
};

export const sortByDateAsc = (data: FlowerArrival[]): FlowerArrival[] => {
  return [...data].sort(
    (a, b) =>
      new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
  );
};

export const filterRefrigerated = (data: FlowerArrival[]): FlowerArrival[] => {
  return data.filter((item) => item.needRefrigeration);
};

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatWeekRangeLabel = (): string => {
  const { label } = getWeekRange();
  return label;
};

export interface WeekDay {
  date: Date;
  dateStr: string;
  dayOfWeek: string;
  shortLabel: string;
  isToday: boolean;
}

export const getWeekDays = (refDate: Date = new Date()): WeekDay[] => {
  const { start } = getWeekRange(refDate);
  const weekDays: WeekDay[] = [];
  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    weekDays.push({
      date,
      dateStr: `${year}-${month}-${day}`,
      dayOfWeek: weekDayNames[i],
      shortLabel: `${date.getMonth() + 1}/${date.getDate()} ${weekDayNames[i]}`,
      isToday: date.getTime() === today.getTime()
    });
  }

  return weekDays;
};
