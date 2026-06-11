import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Package,
  Snowflake,
  Clock,
  DollarSign,
  User,
  FileText,
  AlertCircle,
  CalendarClock
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useArrivalStore } from '@/store/arrivalStore';
import {
  formatDate,
  calculateRemainingDays,
  hasArrived
} from '@/utils/dateUtils';

export default function ArrivalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getArrivalById = useArrivalStore((s) => s.getArrivalById);

  const arrival = id ? getArrivalById(id) : undefined;

  if (!arrival) {
    return (
      <Layout showPrintButton={false}>
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">
            未找到该批次
          </h2>
          <p className="text-gray-500 mb-6">该到货批次可能已被删除或不存在</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回清单</span>
          </button>
        </div>
      </Layout>
    );
  }

  const itemHasArrived = hasArrived(arrival);
  const remainingDays = itemHasArrived ? calculateRemainingDays(arrival) : arrival.freshDays;
  const isExpiringSoon = itemHasArrived && remainingDays <= 3 && remainingDays > 0;
  const isExpired = itemHasArrived && remainingDays === 0;

  const progressPercent = Math.max(
    0,
    Math.min(100, itemHasArrived ? (remainingDays / arrival.freshDays) * 100 : 100)
  );
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const getProgressColor = () => {
    if (!itemHasArrived) return '#8B5CF6';
    if (isExpired) return '#EF4444';
    if (isExpiringSoon) return '#F59E0B';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (!itemHasArrived) return '未到货';
    if (isExpired) return '已过期';
    return `${remainingDays}天后过期`;
  };

  return (
    <Layout showPrintButton={true}>
      <div className="animate-fade-in">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-rose-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>返回到货清单</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden ${
                !itemHasArrived ? 'border-purple-200' : ''
              }`}
            >
              <div
                className={`p-8 ${
                  arrival.needRefrigeration
                    ? 'bg-gradient-to-r from-ice-50 to-ice-100'
                    : 'bg-gradient-to-r from-rose-50 to-rose-100'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl bg-white/80">
                      🌹
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="font-display text-4xl font-bold text-gray-800">
                          {arrival.flowerName}
                        </h1>
                        {arrival.needRefrigeration && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-ice-500 text-white rounded-full text-sm">
                            <Snowflake className="w-3 h-3" />
                            <span>需冷藏</span>
                          </span>
                        )}
                        {!itemHasArrived && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
                            <CalendarClock className="w-3 h-3" />
                            <span>未到货</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(arrival.arrivalDate)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>批次 #{arrival.id}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="font-display text-xl font-semibold text-gray-800 mb-6">
                  花材信息
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-cream-50 rounded-xl">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">到货数量</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {arrival.quantity} 扎
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-cream-50 rounded-xl">
                    <div className="w-10 h-10 bg-leaf-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-leaf-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">保鲜天数</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {arrival.freshDays} 天
                      </p>
                    </div>
                  </div>

                  {arrival.supplier && (
                    <div className="flex items-start space-x-4 p-4 bg-cream-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">供应商</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {arrival.supplier}
                        </p>
                      </div>
                    </div>
                  )}

                  {arrival.unitPrice && (
                    <div className="flex items-start space-x-4 p-4 bg-cream-50 rounded-xl">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">单价</p>
                        <p className="text-2xl font-bold text-gray-800">
                          ¥{arrival.unitPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          合计: ¥{(arrival.unitPrice * arrival.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {arrival.notes && (
                  <div className="mt-6 p-4 bg-cream-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">备注</p>
                        <p className="text-gray-700">{arrival.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
              <h2 className="font-display text-xl font-semibold text-gray-800 mb-6 text-center">
                保鲜倒计时
              </h2>

              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="60"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="60"
                    fill="none"
                    stroke={getProgressColor()}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-1000 ${
                      isExpiringSoon ? 'animate-pulse' : ''
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {!itemHasArrived ? (
                    <>
                      <span className="text-3xl font-bold text-purple-500">
                        {arrival.freshDays}
                      </span>
                      <span className="text-sm text-purple-500">天保鲜期</span>
                    </>
                  ) : isExpired ? (
                    <>
                      <span className="text-4xl font-bold text-red-500">0</span>
                      <span className="text-sm text-red-500">已过期</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`text-4xl font-bold ${
                          isExpiringSoon
                            ? 'text-amber-500 animate-pulse'
                            : 'text-leaf-500'
                        }`}
                      >
                        {remainingDays}
                      </span>
                      <span className="text-sm text-gray-500">{getStatusText()}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">保鲜进度</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: getProgressColor()
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {itemHasArrived
                    ? `已使用 ${
                        arrival.freshDays - remainingDays
                      } 天 / 共 ${arrival.freshDays} 天`
                    : `到货后开始计算 / 共 ${arrival.freshDays} 天`}
                </p>
              </div>

              {!itemHasArrived && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <CalendarClock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-800">等待到货</p>
                      <p className="text-sm text-purple-600">
                        此批次尚未到货，保鲜期将自到货日起计算
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {itemHasArrived && isExpiringSoon && !isExpired && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">请注意</p>
                      <p className="text-sm text-amber-600">此花材即将过期，建议优先使用</p>
                    </div>
                  </div>
                </div>
              )}

              {itemHasArrived && isExpired && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">已过期</p>
                      <p className="text-sm text-red-600">此花材已过保鲜期，请勿使用</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {arrival.needRefrigeration && (
              <div className="bg-gradient-to-br from-ice-400 to-ice-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Snowflake className="w-6 h-6" />
                  <h3 className="font-display text-lg font-semibold">冷藏要求</h3>
                </div>
                <ul className="space-y-2 text-sm text-ice-50">
                  <li className="flex items-start space-x-2">
                    <span className="text-ice-200">•</span>
                    <span>保存温度: 2-8°C</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-ice-200">•</span>
                    <span>避免与水果同放</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-ice-200">•</span>
                    <span>每天检查花材状态</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
