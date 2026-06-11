import { useNavigate } from 'react-router-dom';
import { FlowerArrival, Statistics } from '@/data/types';
import { getBatchStatus } from '@/utils/batchStatus';
import { Package, Snowflake, AlertTriangle, Flower2 } from 'lucide-react';

interface SidebarProps {
  statistics: Statistics;
  allData: FlowerArrival[];
}

export default function Sidebar({ statistics, allData }: SidebarProps) {
  const navigate = useNavigate();

  const handleFlowerClick = (id: string) => {
    navigate(`/arrival/${id}`);
  };

  return (
    <aside className="no-print space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-rose-100 text-sm">本周到货总扎数</p>
            <p className="font-display text-4xl font-bold">{statistics.totalBundles}</p>
          </div>
        </div>
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, statistics.totalBundles / 2)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-ice-400 to-ice-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Snowflake className="w-6 h-6" />
          <p className="text-ice-50 text-sm">需冷藏品种数</p>
        </div>
        <p className="font-display text-4xl font-bold">{statistics.refrigeratedCount}</p>
        <p className="text-ice-100 text-sm mt-2">
          共 {allData.length} 个批次
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="font-display text-lg font-semibold text-gray-800">
            保鲜天数 ≤ 3 天
          </h3>
        </div>

        {statistics.expiringSoon.length === 0 ? (
          <div className="text-center py-6">
            <Flower2 className="w-12 h-12 text-leaf-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">暂无快过期花材</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {statistics.expiringSoon.map((item) => {
              const status = getBatchStatus(item);
              const remainingDays = status.remainingDays;
              const isUrgent = remainingDays <= 1;

              return (
                <li
                  key={item.id}
                  onClick={() => handleFlowerClick(item.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md group ${
                    isUrgent 
                      ? 'bg-red-50 border border-red-200 hover:border-red-300' 
                      : 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {status.needsRefrigeration && (
                        <span className="text-ice-500">❄</span>
                      )}
                      <span className="font-medium text-gray-800 group-hover:text-rose-600 transition-colors">
                        {item.flowerName}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                      isUrgent 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {remainingDays} 天
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{item.quantity} 扎</span>
                    <span className="group-hover:text-rose-500 transition-colors">
                      查看详情 →
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="bg-gradient-to-br from-leaf-400 to-leaf-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Flower2 className="w-6 h-6" />
          <h3 className="font-display text-lg font-semibold">花材小贴士</h3>
        </div>
        <ul className="space-y-2 text-sm text-leaf-50">
          <li className="flex items-start space-x-2">
            <span className="text-leaf-200">•</span>
            <span>需冷藏花材请在 2-8℃ 环境保存</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-leaf-200">•</span>
            <span>每天换水可延长保鲜期 2-3 天</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-leaf-200">•</span>
            <span>快过期花材建议优先使用</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
