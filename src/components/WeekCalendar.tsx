import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowerArrival } from '@/data/types';
import { getWeekDays, WeekDay } from '@/utils/dateUtils';
import {
  getBatchStatus,
  getCalendarCardClasses
} from '@/utils/batchStatus';
import { Snowflake, CalendarClock, Clock, Flower2 } from 'lucide-react';

interface WeekCalendarProps {
  data: FlowerArrival[];
}

export default function WeekCalendar({ data }: WeekCalendarProps) {
  const navigate = useNavigate();
  const weekDays = getWeekDays();

  const groupedByDate = useMemo(() => {
    const groups: Record<string, FlowerArrival[]> = {};
    for (const item of data) {
      if (!groups[item.arrivalDate]) {
        groups[item.arrivalDate] = [];
      }
      groups[item.arrivalDate].push(item);
    }
    return groups;
  }, [data]);

  const handleCardClick = (id: string) => {
    navigate(`/arrival/${id}`);
  };

  const getStatusBadge = (item: FlowerArrival) => {
    const status = getBatchStatus(item);
    const { primaryStatus, remainingDays, shortStatusText } = status;

    if (primaryStatus === 'not_arrived') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500 text-white">
          <CalendarClock className="w-3 h-3" />
          <span>{shortStatusText}</span>
        </span>
      );
    }
    if (primaryStatus === 'expired') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
          <Clock className="w-3 h-3" />
          <span>{shortStatusText}</span>
        </span>
      );
    }
    if (primaryStatus === 'expiring_soon') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
          <Clock className="w-3 h-3" />
          <span>{shortStatusText}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-leaf-500 text-white">
        <Clock className="w-3 h-3" />
        <span>{shortStatusText}</span>
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="no-print bg-white rounded-2xl shadow-sm border border-rose-100 p-12 text-center animate-fade-in">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <p className="text-gray-500 text-lg">当前筛选下暂无到货批次</p>
        <p className="text-gray-400 text-sm mt-2">请调整筛选条件或登记新到货</p>
      </div>
    );
  }

  return (
    <div className="no-print bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden animate-fade-in">
      <div className="grid grid-cols-7 divide-x divide-rose-100">
        {weekDays.map((day: WeekDay) => (
          <div
            key={day.dateStr}
            className={`p-3 text-center border-b-2 ${
              day.isToday
                ? 'bg-rose-50 border-rose-300'
                : 'bg-gradient-to-b from-rose-50/50 to-white border-rose-100'
            }`}
          >
            <div
              className={`text-sm font-display font-semibold ${
                day.isToday ? 'text-rose-600' : 'text-gray-700'
              }`}
            >
              {day.dayOfWeek}
            </div>
            <div
              className={`text-lg font-bold ${
                day.isToday ? 'text-rose-500' : 'text-gray-800'
              }`}
            >
              {day.shortLabel.split(' ')[0]}
            </div>
            {day.isToday && (
              <div className="text-xs text-rose-500 font-medium">今天</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-rose-100 min-h-[400px]">
        {weekDays.map((day: WeekDay) => {
          const dayData = groupedByDate[day.dateStr] || [];

          return (
            <div
              key={day.dateStr}
              className={`p-2 ${
                day.isToday ? 'bg-rose-50/30' : ''
              }`}
            >
              {dayData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8 text-gray-400">
                  <Flower2 className="w-6 h-6 mb-1 opacity-30" />
                  <span className="text-xs">无到货</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayData.map((item) => {
                    const status = getBatchStatus(item);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item.id)}
                        className={getCalendarCardClasses(status)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center space-x-1 min-w-0">
                            {status.needsRefrigeration && (
                              <Snowflake className="w-3.5 h-3.5 text-ice-500 flex-shrink-0" />
                            )}
                            <span className="font-medium text-gray-800 text-sm truncate">
                              {item.flowerName}
                            </span>
                          </div>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex-shrink-0">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          {getStatusBadge(item)}
                          <span className="text-xs text-gray-400 group-hover:text-rose-500 transition-colors">
                            详情 →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-rose-100 bg-rose-50/30 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded bg-purple-200 border border-purple-300"></span>
          <span>未到货</span>
        </span>
        <span className="flex items-center space-x-1">
          <Snowflake className="w-3 h-3 text-ice-500" />
          <span>需冷藏</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300"></span>
          <span>快过期(≤3天)</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded bg-red-200 border border-red-300"></span>
          <span>已过期</span>
        </span>
      </div>
    </div>
  );
}
