import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FlowerArrival, FilterType, Statistics } from '@/data/types';
import { seedData } from '@/data/seedData';
import {
  sortByDateAsc,
  filterRefrigerated,
  getWeekRange,
  isDateInRange
} from '@/utils/dateUtils';
import { calculateStatistics as calcStats } from '@/utils/batchStatus';

export type ViewMode = 'table' | 'calendar';

interface ArrivalState {
  data: FlowerArrival[];
  filter: FilterType;
  onlyThisWeek: boolean;
  viewMode: ViewMode;
  setData: (data: FlowerArrival[]) => void;
  setFilter: (filter: FilterType) => void;
  setOnlyThisWeek: (only: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleFilter: () => void;
  toggleOnlyThisWeek: () => void;
  toggleViewMode: () => void;
  addArrival: (newArrival: Omit<FlowerArrival, 'id'>) => void;
  removeArrival: (id: string) => void;
  getArrivalById: (id: string) => FlowerArrival | undefined;
  getWeeklyData: () => FlowerArrival[];
  getFilteredData: () => FlowerArrival[];
  getStatistics: (scope?: 'all' | 'weekly' | 'filtered') => Statistics;
  resetData: () => void;
}

export const useArrivalStore = create<ArrivalState>()(
  persist(
    (set, get) => ({
      data: seedData,
      filter: 'all',
      onlyThisWeek: true,
      viewMode: 'table',

      setData: (data) => set({ data }),
      setFilter: (filter) => set({ filter }),
      setOnlyThisWeek: (only) => set({ onlyThisWeek: only }),
      setViewMode: (viewMode) => set({ viewMode }),

      toggleFilter: () =>
        set((state) => ({
          filter: state.filter === 'all' ? 'refrigerated' : 'all'
        })),

      toggleOnlyThisWeek: () =>
        set((state) => ({
          onlyThisWeek: !state.onlyThisWeek
        })),

      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === 'table' ? 'calendar' : 'table'
        })),

      addArrival: (newArrival) => {
        const id = String(Date.now());
        set((state) => ({
          data: [...state.data, { ...newArrival, id }]
        }));
      },

      removeArrival: (id) =>
        set((state) => ({
          data: state.data.filter((item) => item.id !== id)
        })),

      getArrivalById: (id) => {
        return get().data.find((item) => item.id === id);
      },

      getWeeklyData: () => {
        const { data } = get();
        const { start, end } = getWeekRange();
        const weeklyData = data.filter((item) =>
          isDateInRange(item.arrivalDate, start, end)
        );
        return sortByDateAsc(weeklyData);
      },

      getFilteredData: () => {
        const { filter, onlyThisWeek, getWeeklyData, data } = get();
        let result = onlyThisWeek ? getWeeklyData() : [...data];
        if (filter === 'refrigerated') {
          result = filterRefrigerated(result);
        }
        return sortByDateAsc(result);
      },

      getStatistics: (scope = 'filtered') => {
        const { getWeeklyData, getFilteredData, data } = get();
        let source: FlowerArrival[];
        switch (scope) {
          case 'weekly':
            source = getWeeklyData();
            break;
          case 'all':
            source = data;
            break;
          case 'filtered':
          default:
            source = getFilteredData();
        }
        return calcStats(source);
      },

      resetData: () =>
        set({
          data: seedData,
          filter: 'all',
          onlyThisWeek: true,
          viewMode: 'table'
        })
    }),
    {
      name: 'flower-arrival-storage',
      partialize: (state) => ({ data: state.data })
    }
  )
);
