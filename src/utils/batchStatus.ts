import { FlowerArrival, Statistics } from '@/data/types';
import { hasArrived, calculateRemainingDays } from './dateUtils';

export type BatchPrimaryStatus =
  | 'not_arrived'
  | 'expired'
  | 'expiring_soon'
  | 'normal';

export interface BatchStatusResult {
  primaryStatus: BatchPrimaryStatus;
  remainingDays: number;
  hasArrived: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  needsRefrigeration: boolean;
  isInStock: boolean;
  displayText: string;
  shortStatusText: string;
  color: {
    primary: string;
    secondary: string;
    bg: string;
    border: string;
  };
}

export const BATCH_STATUS_PRIORITY: BatchPrimaryStatus[] = [
  'not_arrived',
  'expired',
  'expiring_soon',
  'normal'
];

const STATUS_CONFIG: Record<
  BatchPrimaryStatus,
  {
    displayText: (remaining: number, freshDays: number) => string;
    shortStatusText: (remaining: number) => string;
    color: {
      primary: string;
      secondary: string;
      bg: string;
      border: string;
    };
  }
> = {
  not_arrived: {
    displayText: (_, freshDays) => `未到货（${freshDays}天保鲜期）`,
    shortStatusText: () => '未到货',
    color: {
      primary: '#8B5CF6',
      secondary: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  },
  expired: {
    displayText: () => '已过期',
    shortStatusText: () => '已过期',
    color: {
      primary: '#EF4444',
      secondary: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  },
  expiring_soon: {
    displayText: (remaining) => `剩余 ${remaining} 天`,
    shortStatusText: (remaining) => `剩 ${remaining} 天`,
    color: {
      primary: '#F59E0B',
      secondary: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-300'
    }
  },
  normal: {
    displayText: (remaining) => `剩余 ${remaining} 天`,
    shortStatusText: (remaining) => `剩 ${remaining} 天`,
    color: {
      primary: '#4CAF50',
      secondary: 'text-leaf-700',
      bg: 'bg-white',
      border: 'border-rose-100'
    }
  }
};

export const getBatchStatus = (arrival: FlowerArrival): BatchStatusResult => {
  const arrived = hasArrived(arrival);
  const remaining = arrived
    ? calculateRemainingDays(arrival)
    : arrival.freshDays;

  const expired = arrived && remaining === 0;
  const expiringSoon = arrived && remaining <= 3 && remaining > 0;
  const needsRefrigeration = arrival.needRefrigeration;
  const inStock = arrived && remaining > 0;

  let primaryStatus: BatchPrimaryStatus = 'normal';
  if (!arrived) {
    primaryStatus = 'not_arrived';
  } else if (expired) {
    primaryStatus = 'expired';
  } else if (expiringSoon) {
    primaryStatus = 'expiring_soon';
  }

  const config = STATUS_CONFIG[primaryStatus];

  return {
    primaryStatus,
    remainingDays: remaining,
    hasArrived: arrived,
    isExpired: expired,
    isExpiringSoon: expiringSoon,
    needsRefrigeration,
    isInStock: inStock,
    displayText: config.displayText(remaining, arrival.freshDays),
    shortStatusText: config.shortStatusText(remaining),
    color: { ...config.color }
  };
};

export const isBatchInStock = (arrival: FlowerArrival): boolean => {
  return getBatchStatus(arrival).isInStock;
};

export const isBatchExpiringSoon = (arrival: FlowerArrival): boolean => {
  return getBatchStatus(arrival).isExpiringSoon;
};

export const getBatchStatusPriority = (
  status: BatchPrimaryStatus
): number => {
  return BATCH_STATUS_PRIORITY.indexOf(status);
};

export const compareBatchStatus = (
  a: FlowerArrival,
  b: FlowerArrival
): number => {
  const statusA = getBatchStatus(a);
  const statusB = getBatchStatus(b);
  return (
    getBatchStatusPriority(statusA.primaryStatus) -
    getBatchStatusPriority(statusB.primaryStatus)
  );
};

export const getCalendarCardClasses = (status: BatchStatusResult): string => {
  const base =
    'p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-2 mb-2';
  const statusClasses: Record<BatchPrimaryStatus, string> = {
    not_arrived: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    expired: 'bg-red-50 border-red-200 hover:border-red-400 opacity-75',
    expiring_soon:
      'bg-amber-50 border-amber-300 hover:border-amber-500 animate-pulse-red',
    normal: status.needsRefrigeration
      ? 'bg-ice-50 border-ice-300 hover:border-ice-500'
      : 'bg-white border-rose-100 hover:border-rose-300'
  };
  return `${base} ${statusClasses[status.primaryStatus]}`;
};

export const getTableBadgeClasses = (status: BatchStatusResult): string => {
  const base =
    'inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium';
  const statusClasses: Record<BatchPrimaryStatus, string> = {
    not_arrived: 'bg-purple-100 text-purple-700',
    expired: 'bg-red-100 text-red-700',
    expiring_soon: 'bg-amber-100 text-amber-700 animate-pulse-red',
    normal: 'bg-leaf-100 text-leaf-700'
  };
  return `${base} ${statusClasses[status.primaryStatus]}`;
};

export const getProgressColor = (status: BatchStatusResult): string => {
  return status.color.primary;
};

export const calculateStatistics = (data: FlowerArrival[]): Statistics => {
  const totalBundles = data.reduce((sum, item) => sum + item.quantity, 0);
  const refrigeratedCount = data.filter((item) => item.needRefrigeration).length;
  const expiringSoon = data.filter((item) => isBatchExpiringSoon(item));

  return {
    totalBundles,
    refrigeratedCount,
    expiringSoon
  };
};

export const filterInStock = (data: FlowerArrival[]): FlowerArrival[] => {
  return data.filter((item) => isBatchInStock(item));
};
