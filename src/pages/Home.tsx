import Layout from '@/components/Layout';
import FilterBar from '@/components/FilterBar';
import ArrivalTable from '@/components/ArrivalTable';
import Sidebar from '@/components/Sidebar';
import { useArrivalStore } from '@/store/arrivalStore';
import { getWeekRange } from '@/utils/dateUtils';
import { Flower2, Calendar } from 'lucide-react';

export default function Home() {
  const filter = useArrivalStore((s) => s.filter);
  const onlyThisWeek = useArrivalStore((s) => s.onlyThisWeek);
  const toggleFilter = useArrivalStore((s) => s.toggleFilter);
  const toggleOnlyThisWeek = useArrivalStore((s) => s.toggleOnlyThisWeek);
  const getFilteredData = useArrivalStore((s) => s.getFilteredData);
  const getStatistics = useArrivalStore((s) => s.getStatistics);
  const getWeeklyData = useArrivalStore((s) => s.getWeeklyData);
  const data = useArrivalStore((s) => s.data);

  const filteredData = getFilteredData();
  const statistics = getStatistics('filtered');
  const weeklyData = getWeeklyData();
  const { label: weekLabel } = getWeekRange();

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArrivalTable data={filteredData} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar statistics={statistics} allData={filteredData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
