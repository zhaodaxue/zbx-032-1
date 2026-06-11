import { FlowerArrival, Statistics } from '@/data/types';

export const calculateRemainingDays = (arrival: FlowerArrival): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const arrivalDate = new Date(arrival.arrivalDate);
  arrivalDate.setHours(0, 0, 0, 0);
  const daysSinceArrival = Math.floor((today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, arrival.freshDays - daysSinceArrival);
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

export const calculateStatistics = (data: FlowerArrival[]): Statistics => {
  const totalBundles = data.reduce((sum, item) => sum + item.quantity, 0);
  const refrigeratedCount = data.filter(item => item.needRefrigeration).length;
  const expiringSoon = data.filter(item => {
    const remaining = calculateRemainingDays(item);
    return remaining <= 3 && remaining > 0;
  });

  return {
    totalBundles,
    refrigeratedCount,
    expiringSoon
  };
};

export const sortByDateAsc = (data: FlowerArrival[]): FlowerArrival[] => {
  return [...data].sort((a, b) => 
    new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
  );
};

export const filterRefrigerated = (data: FlowerArrival[]): FlowerArrival[] => {
  return data.filter(item => item.needRefrigeration);
};

export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
