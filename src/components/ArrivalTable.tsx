import { useNavigate } from 'react-router-dom';
import { FlowerArrival } from '@/data/types';
import { formatShortDate, calculateRemainingDays, hasArrived } from '@/utils/dateUtils';
import { Clock, CalendarClock } from 'lucide-react';

interface ArrivalTableProps {
  data: FlowerArrival[];
}

export default function ArrivalTable({ data }: ArrivalTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/arrival/${id}`);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🌹</div>
        <p className="text-gray-500 text-lg">暂无到货数据</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden animate-fade-in print-container">
      <div className="print-title hidden print:block">
        <h2 className="font-display text-2xl font-bold text-gray-800">每周花材到货清单</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full print-table">
          <thead>
            <tr className="bg-gradient-to-r from-rose-50 to-rose-100 print:bg-gray-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-display w-12">
                <span className="sr-only">冷藏</span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-display">
                到货日期
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-display">
                花材名称
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                数量（扎）
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                保鲜天数
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display no-print">
                状态
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display no-print">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {data.map((item, index) => {
              const itemHasArrived = hasArrived(item);
              const remainingDays = calculateRemainingDays(item);
              const isExpiringSoon = itemHasArrived && remainingDays <= 3 && remainingDays > 0;
              const isExpired = itemHasArrived && remainingDays === 0;

              return (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`transition-all duration-200 cursor-pointer group
                    ${item.needRefrigeration ? 'bg-ice-50/50 hover:bg-ice-100/50 refrigerated-row' : 'hover:bg-rose-50/50'}
                    ${index % 2 === 0 ? '' : 'bg-gray-50/30'}
                    ${!itemHasArrived ? 'opacity-75' : ''}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    {item.needRefrigeration && (
                      <span className="text-ice-500 text-xl" title="需冷藏">
                        ❄
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatShortDate(item.arrivalDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                      {item.flowerName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold text-sm">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {item.freshDays} 天
                  </td>
                  <td className="px-6 py-4 text-center no-print">
                    {!itemHasArrived ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        <CalendarClock className="w-3 h-3" />
                        <span>未到货</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                          isExpired
                            ? 'bg-red-100 text-red-700'
                            : isExpiringSoon
                            ? 'bg-amber-100 text-amber-700 animate-pulse-red'
                            : 'bg-leaf-100 text-leaf-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{isExpired ? '已过期' : `剩余 ${remainingDays} 天`}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center no-print">
                    <span className="inline-block text-rose-500 group-hover:text-rose-600 text-sm font-medium">
                      查看详情 →
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="print-footer hidden print:block">
        <p>打印日期：{new Date().toLocaleDateString('zh-CN')}</p>
        <p>街角花店</p>
      </div>
    </div>
  );
}
