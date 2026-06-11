export interface FlowerArrival {
  id: string;
  arrivalDate: string;
  flowerName: string;
  quantity: number;
  freshDays: number;
  needRefrigeration: boolean;
  supplier?: string;
  unitPrice?: number;
  notes?: string;
}

export interface Statistics {
  totalBundles: number;
  refrigeratedCount: number;
  expiringSoon: FlowerArrival[];
}

export type FilterType = 'all' | 'refrigerated';
