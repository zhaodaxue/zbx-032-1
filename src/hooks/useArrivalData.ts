import { useState, useMemo, useCallback } from 'react';
import { FlowerArrival, FilterType, Statistics } from '@/data/types';
import { seedData } from '@/data/seedData';
import { sortByDateAsc, filterRefrigerated, calculateStatistics } from '@/utils/dateUtils';

export const useArrivalData = () => {
  const [data, setData] = useState<FlowerArrival[]>(seedData);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filter === 'refrigerated') {
      result = filterRefrigerated(result);
    }
    return sortByDateAsc(result);
  }, [data, filter]);

  const statistics = useMemo<Statistics>(() => {
    return calculateStatistics(filteredData);
  }, [filteredData]);

  const toggleFilter = useCallback(() => {
    setFilter(prev => prev === 'all' ? 'refrigerated' : 'all');
  }, []);

  const addArrival = useCallback((newArrival: Omit<FlowerArrival, 'id'>) => {
    const id = String(Date.now());
    setData(prev => [...prev, { ...newArrival, id }]);
  }, []);

  const getArrivalById = useCallback((id: string): FlowerArrival | undefined => {
    return data.find(item => item.id === id);
  }, [data]);

  return {
    data,
    filteredData,
    statistics,
    filter,
    setFilter,
    toggleFilter,
    addArrival,
    getArrivalById
  };
};
