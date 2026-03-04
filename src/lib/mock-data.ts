
export interface Trend {
  id: string;
  name: string;
  category: string;
  status: 'Emerging' | 'Growing' | 'Mainstream' | 'Declining';
  description: string;
  growthRate: number;
  marketShare: number;
  associatedCollections?: string[];
}

export const FASHION_TRENDS: Trend[] = [
  {
    id: '1',
    name: 'Quiet Luxury',
    category: 'Apparel',
    status: 'Mainstream',
    description: 'Minimalist, logo-free high-end fashion focusing on quality materials.',
    growthRate: 15,
    marketShare: 22,
    associatedCollections: ['The Row', 'Loro Piana', 'Celine']
  },
  {
    id: '2',
    name: 'Neo-Gothic Accessories',
    category: 'Accessories',
    status: 'Emerging',
    description: 'Dark, romantic accessories featuring lace, velvet, and metallic hardware.',
    growthRate: 45,
    marketShare: 5,
    associatedCollections: ['Alexander McQueen', 'Rick Owens']
  },
  {
    id: '3',
    name: 'Tech-Infused Footwear',
    category: 'Footwear',
    status: 'Growing',
    description: 'Sneakers and boots incorporating smart materials and modular designs.',
    growthRate: 32,
    marketShare: 12,
    associatedCollections: ['Nike ISPA', 'Adidas Y-3']
  },
  {
    id: '4',
    name: 'Barbiecore Pink',
    category: 'Apparel',
    status: 'Declining',
    description: 'Vibrant hot pink aesthetic inspired by iconic pop culture figures.',
    growthRate: -12,
    marketShare: 18,
    associatedCollections: ['Valentino PP', 'Balmain']
  },
  {
    id: '5',
    name: 'Upcycled Denim',
    category: 'Apparel',
    status: 'Growing',
    description: 'Eco-conscious fashion using vintage denim scraps to create new silhouettes.',
    growthRate: 28,
    marketShare: 8,
    associatedCollections: ['Marine Serre', 'Levi\'s Re/Done']
  },
  {
    id: '6',
    name: 'Cyberpunk Utility',
    category: 'Apparel',
    status: 'Emerging',
    description: 'Functional gear with tactical elements, straps, and high-performance fabrics.',
    growthRate: 58,
    marketShare: 4,
    associatedCollections: ['Acronym', 'Stone Island Shadow Project']
  },
  {
    id: '7',
    name: 'Sculptural Eyewear',
    category: 'Accessories',
    status: 'Growing',
    description: 'Avant-garde sunglasses with non-traditional shapes and 3D-printed frames.',
    growthRate: 22,
    marketShare: 7,
    associatedCollections: ['Gentle Monster', 'Loewe']
  }
];

export const CATEGORY_STATS = [
  { name: 'Apparel', value: 45 },
  { name: 'Accessories', value: 25 },
  { name: 'Footwear', value: 20 },
  { name: 'Beauty', value: 10 },
];

export const GROWTH_DATA = [
  { month: 'Jan', rate: 12 },
  { month: 'Feb', rate: 18 },
  { month: 'Mar', rate: 15 },
  { month: 'Apr', rate: 25 },
  { month: 'May', rate: 32 },
  { month: 'Jun', rate: 28 },
];
