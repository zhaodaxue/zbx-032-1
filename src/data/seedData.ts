import { FlowerArrival } from './types';

export const seedData: FlowerArrival[] = [
  {
    id: '1',
    arrivalDate: '2026-06-08',
    flowerName: '玫瑰',
    quantity: 50,
    freshDays: 5,
    needRefrigeration: true,
    supplier: '昆明花田',
    unitPrice: 12.5,
    notes: '红玫瑰，A级品质'
  },
  {
    id: '2',
    arrivalDate: '2026-06-09',
    flowerName: '向日葵',
    quantity: 30,
    freshDays: 7,
    needRefrigeration: false,
    supplier: '云南基地',
    unitPrice: 8.0,
    notes: '大花头'
  },
  {
    id: '3',
    arrivalDate: '2026-06-10',
    flowerName: '百合',
    quantity: 20,
    freshDays: 3,
    needRefrigeration: true,
    supplier: '广州花卉',
    unitPrice: 15.0,
    notes: '香水百合，多花苞'
  },
  {
    id: '4',
    arrivalDate: '2026-06-11',
    flowerName: '满天星',
    quantity: 40,
    freshDays: 2,
    needRefrigeration: false,
    supplier: '本地花市',
    unitPrice: 6.5,
    notes: '白色满天星'
  },
  {
    id: '5',
    arrivalDate: '2026-06-12',
    flowerName: '洋桔梗',
    quantity: 25,
    freshDays: 4,
    needRefrigeration: true,
    supplier: '昆明花田',
    unitPrice: 10.0,
    notes: '粉色系'
  }
];
