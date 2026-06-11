import { Snowflake, Calendar } from 'lucide-react';

interface FilterBarProps {
  filter: 'all' | 'refrigerated';
  onToggleFilter: () => void;
  onlyThisWeek: boolean;
  onToggleWeek: () => void;
  weeklyCount: number;
  totalCount: number;
}

export default function FilterBar({
  filter,
  onToggleFilter,
  onlyThisWeek,
  onToggleWeek,
  weeklyCount,
  totalCount
}: FilterBarProps) {
  const isRefrigerated = filter === 'refrigerated';

  return (
    <div className="no-print mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-xl shadow-sm border border-rose-100">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={onlyThisWeek}
                onChange={onToggleWeek}
                className="sr-only peer"
              />
              <div
                className={`w-12 h-7 rounded-full transition-all duration-300 ${
                  onlyThisWeek ? 'bg-rose-500' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 flex items-center justify-center ${
                  onlyThisWeek ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {onlyThisWeek && (
                  <Calendar className="w-4 h-4 text-rose-500" />
                )}
              </div>
            </div>
            <span
              className={`font-medium transition-colors duration-200 ${
                onlyThisWeek
                  ? 'text-rose-600'
                  : 'text-gray-600 group-hover:text-gray-800'
              }`}
            >
              仅看本周
            </span>
          </label>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isRefrigerated}
              onChange={onToggleFilter}
              className="sr-only peer"
            />
            <div
              className={`w-12 h-7 rounded-full transition-all duration-300 ${
                isRefrigerated ? 'bg-ice-500' : 'bg-gray-300'
              }`}
            ></div>
            <div
              className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 flex items-center justify-center ${
                isRefrigerated ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {isRefrigerated && (
                <Snowflake className="w-4 h-4 text-ice-500" />
              )}
            </div>
          </div>
          <span
            className={`font-medium transition-colors duration-200 ${
              isRefrigerated
                ? 'text-ice-600'
                : 'text-gray-600 group-hover:text-gray-800'
            }`}
          >
            仅看需冷藏
          </span>
        </label>

        <div className="flex-1"></div>

        <div className="text-sm text-gray-500">
          {onlyThisWeek ? (
            <span>
              本周 <strong className="text-rose-600">{weeklyCount}</strong> 个批次
              {!isRefrigerated && totalCount > weeklyCount && (
                <span className="text-gray-400"> / 全部 {totalCount}</span>
              )}
            </span>
          ) : (
            <span>
              显示全部 <strong className="text-gray-700">{totalCount}</strong> 个批次
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
