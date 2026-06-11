import { useState } from 'react';
import { Package, Plus, Snowflake, Leaf, TrendingUp, Calendar, Flower2, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useArrivalData } from '@/hooks/useArrivalData';
import { getTodayString, calculateRemainingDays, sortByDateAsc } from '@/utils/dateUtils';
import { FlowerArrival } from '@/data/types';

export default function Inventory() {
  const { data, addArrival } = useArrivalData();
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    arrivalDate: getTodayString(),
    flowerName: '',
    quantity: 10,
    freshDays: 5,
    needRefrigeration: false,
    supplier: '',
    unitPrice: 10,
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newArrival: Omit<FlowerArrival, 'id'> = {
      arrivalDate: formData.arrivalDate,
      flowerName: formData.flowerName,
      quantity: formData.quantity,
      freshDays: formData.freshDays,
      needRefrigeration: formData.needRefrigeration,
      supplier: formData.supplier || undefined,
      unitPrice: formData.unitPrice || undefined,
      notes: formData.notes || undefined
    };

    addArrival(newArrival);
    
    setSuccessMessage(`成功登记 ${formData.flowerName} ${formData.quantity} 扎`);
    setTimeout(() => setSuccessMessage(''), 3000);

    setFormData({
      arrivalDate: getTodayString(),
      flowerName: '',
      quantity: 10,
      freshDays: 5,
      needRefrigeration: false,
      supplier: '',
      unitPrice: 10,
      notes: ''
    });
    setShowForm(false);
  };

  const totalValue = data.reduce((sum, item) => {
    const remaining = calculateRemainingDays(item);
    if (remaining > 0 && item.unitPrice) {
      return sum + (item.unitPrice * item.quantity);
    }
    return sum;
  }, 0);

  const totalQuantity = data.reduce((sum, item) => {
    const remaining = calculateRemainingDays(item);
    if (remaining > 0) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  const refrigeratedCount = data.filter(item => {
    const remaining = calculateRemainingDays(item);
    return remaining > 0 && item.needRefrigeration;
  }).length;

  const activeData = data.filter(item => calculateRemainingDays(item) > 0);
  const sortedData = sortByDateAsc(activeData);

  const flowerTypes = [...new Set(data.map(item => item.flowerName))];

  return (
    <Layout showPrintButton={false}>
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-leaf-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-leaf-500" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-800">
                  进销存管理
                </h1>
                <p className="text-gray-500 mt-1">登记到货、查看库存</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all duration-200 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>登记到货</span>
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-leaf-50 border border-leaf-200 rounded-xl flex items-center space-x-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-leaf-500" />
            <span className="text-leaf-700">{successMessage}</span>
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-rose-100 p-8 animate-fade-in">
            <h2 className="font-display text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-rose-500" />
              <span>登记新到货</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    花材名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="flowerName"
                    value={formData.flowerName}
                    onChange={handleInputChange}
                    required
                    placeholder="如：玫瑰、百合"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    到货日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数量（扎） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    保鲜天数 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="freshDays"
                    value={formData.freshDays}
                    onChange={handleInputChange}
                    min="1"
                    max="30"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    单价（元/扎）
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    供应商
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="如：昆明花田"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="needRefrigeration"
                    checked={formData.needRefrigeration}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-ice-500 border-gray-300 rounded focus:ring-ice-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Snowflake className="w-5 h-5 text-ice-500" />
                    <span className="text-gray-700 font-medium">此花材需要冷藏</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="如：品种、等级、特殊要求等"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all duration-200 hover:shadow-lg font-medium"
                >
                  确认登记
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <TrendingUp className="w-6 h-6 text-rose-200" />
            </div>
            <p className="text-rose-100 text-sm mb-1">当前在库</p>
            <p className="font-display text-4xl font-bold">{totalQuantity} 扎</p>
            <p className="text-rose-100 text-sm mt-2">{flowerTypes.length} 种花材</p>
          </div>

          <div className="bg-gradient-to-br from-ice-400 to-ice-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Snowflake className="w-6 h-6" />
              </div>
              <Leaf className="w-6 h-6 text-ice-200" />
            </div>
            <p className="text-ice-100 text-sm mb-1">需冷藏品种</p>
            <p className="font-display text-4xl font-bold">{refrigeratedCount}</p>
            <p className="text-ice-100 text-sm mt-2">2-8°C 保存</p>
          </div>

          <div className="bg-gradient-to-br from-leaf-400 to-leaf-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Package className="w-6 h-6 text-leaf-200" />
            </div>
            <p className="text-leaf-100 text-sm mb-1">库存价值</p>
            <p className="font-display text-4xl font-bold">¥{totalValue.toFixed(0)}</p>
            <p className="text-leaf-100 text-sm mt-2">按采购价计算</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
          <div className="p-6 border-b border-rose-100">
            <h2 className="font-display text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Flower2 className="w-5 h-5 text-rose-500" />
              <span>当前库存花材</span>
            </h2>
          </div>

          {sortedData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🌹</div>
              <p className="text-gray-500 text-lg">暂无在库花材</p>
              <p className="text-gray-400 text-sm mt-2">点击「登记到货」添加新批次</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-leaf-50 to-leaf-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 font-display">
                      花材
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                      到货日
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                      数量
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                      保鲜期
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                      剩余
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 font-display">
                      冷藏
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-50">
                  {sortedData.map((item, index) => {
                    const remaining = calculateRemainingDays(item);
                    const isExpiringSoon = remaining <= 3;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-leaf-50/50 transition-colors ${
                          index % 2 === 0 ? '' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌹</span>
                            <span className="font-medium text-gray-800">{item.flowerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          <div className="flex items-center justify-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{item.arrivalDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf-100 text-leaf-700 font-bold text-sm">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {item.freshDays} 天
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isExpiringSoon
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-leaf-100 text-leaf-700'
                          }`}>
                            {remaining} 天
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.needRefrigeration ? (
                            <span className="text-ice-500 text-xl" title="需冷藏">❄</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
