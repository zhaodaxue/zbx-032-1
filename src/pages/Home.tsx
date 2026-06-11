import Layout from '@/components/Layout';
import FilterBar from '@/components/FilterBar';
import ArrivalTable from '@/components/ArrivalTable';
import Sidebar from '@/components/Sidebar';
import { useArrivalData } from '@/hooks/useArrivalData';
import { Flower2, Calendar } from 'lucide-react';

export default function Home() {
  const { filteredData, statistics, filter, toggleFilter, data } = useArrivalData();

  const getWeekRange = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const format = (date: Date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    };
    
    return `${format(monday)} - ${format(sunday)}`;
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
                <span className="text-sm">{getWeekRange()}</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm">共 {filteredData.length} 个批次</span>
              </div>
            </div>
          </div>
        </div>

        <FilterBar filter={filter} onToggle={toggleFilter} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArrivalTable data={filteredData} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar statistics={statistics} allData={data} />
          </div>
        </div>
      </div>
    </Layout>
  );
}