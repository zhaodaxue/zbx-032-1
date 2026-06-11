import Layout from '@/components/Layout';
import FilterBar from '@/components/FilterBar';
import ArrivalTable from '@/components/ArrivalTable';
import Sidebar from '@/components/Sidebar';
import WeekCalendar from '@/components/WeekCalendar';
import { useArrivalStore, ViewMode } from '@/store/arrivalStore';
import { getWeekRange } from '@/utils/dateUtils';
import { Flower2, Calendar, List, LayoutGrid } from 'lucide-react';

export default function Home() {
  const filter = useArrivalStore((s) => s.filter);
  const onlyThisWeek = useArrivalStore((s) => s.onlyThisWeek);
  const viewMode = useArrivalStore((s) => s.viewMode);
  const toggleFilter = useArrivalStore((s) => s.toggleFilter);
  const toggleOnlyThisWeek = useArrivalStore((s) => s.toggleOnlyThisWeek);
  const setViewMode = useArrivalStore((s) => s.setViewMode);
  const getFilteredData = useArrivalStore((s) => s.getFilteredData);
  const getStatistics = useArrivalStore((s) => s.getStatistics);
  const getWeeklyData = useArrivalStore((s) => s.getWeeklyData);
  const data = useArrivalStore((s) => s.data);

  const filteredData = getFilteredData();
  const statistics = getStatistics('filtered');
  const weeklyData = getWeeklyData();
  const { label: weekLabel } = getWeekRange();

  const handleTabChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <Layout showPrintButton={true}>
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-800">
                每周花材到货清单
              </h1>
              <div className="flex items-center space-x-2 text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{weekLabel}</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm">
                  当前显示 {filteredData.length} 个批次
                </span>
              </div>
            </div>
          </div>
        </div>

        <FilterBar
          filter={filter}
          onToggleFilter={toggleFilter}
          onlyThisWeek={onlyThisWeek}
          onToggleWeek={toggleOnlyThisWeek}
          weeklyCount={weeklyData.length}
          totalCount={data.length}
        />

        <div className="no-print mb-6 flex space-x-1 bg-rose-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => handleTabChange('table')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            <span>表格视图</span>
          </button>
          <button
            onClick={() => handleTabChange('calendar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === 'calendar'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>本周日历</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`print-only-always ${viewMode === 'table' ? '' : 'hidden'}`}>
              <ArrivalTable data={filteredData} />
            </div>
            <div className={`no-print ${viewMode === 'calendar' ? '' : 'hidden'}`}>
              <WeekCalendar data={filteredData} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Sidebar statistics={statistics} allData={filteredData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
