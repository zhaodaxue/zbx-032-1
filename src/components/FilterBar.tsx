import { Snowflake } from 'lucide-react';

interface FilterBarProps {
  filter: 'all' | 'refrigerated';
  onToggle: () => void;
}

export default function FilterBar({ filter, onToggle }: FilterBarProps) {
  const isRefrigerated = filter === 'refrigerated';

  return (
    <div className="no-print mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-rose-100">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 font-medium">筛选：</span>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isRefrigerated}
                onChange={onToggle}
                className="sr-only peer"
              />
              <div className={`w-12 h-7 rounded-full transition-all duration-300 ${
                isRefrigerated ? 'bg-ice-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 flex items-center justify-center ${
                isRefrigerated ? 'translate-x-5' : 'translate-x-0'
              }`}>
                {isRefrigerated && <Snowflake className="w-4 h-4 text-ice-500" />}
              </div>
            </div>
            <span className={`font-medium transition-colors duration-200 ${
              isRefrigerated ? 'text-ice-600' : 'text-gray-600 group-hover:text-gray-800'
            }`}>
              仅看需冷藏
            </span>
          </label>
        </div>

        <div className="flex-1"></div>

        <div className="text-sm text-gray-500">
          {isRefrigerated ? (
            <span className="flex items-center space-x-1">
              <Snowflake className="w-4 h-4 text-ice-500" />
              <span>当前显示需冷藏花材</span>
            </span>
          ) : (
            <span>显示全部到货批次</span>
          )}
        </div>
      </div>
    </div>
  );
}
