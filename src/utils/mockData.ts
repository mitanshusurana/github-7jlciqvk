import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import {
  AnyProduct,
  LooseGemstone,
  CarvedIdol,
  JewelryItem,
  ProductType,
  CreationMethod,
  ClarityGrade,
  Condition,
  ReservationStatus,
  FinishType,
  CarvingStyle,
  Rarity,
  WorkmanshipGrade,
  JewelryCategory,
  JewelryStyle,
  Metal,
  Hallmark,
  SettingType,
  Warranty,
  User,
} from '../types';

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get random number in range
const getRandomNumber = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    createdAt: format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor',
    createdAt: format(subDays(new Date(), 25), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
  },
];

const generateBaseProduct = (productType: ProductType): any => {
  return {
    id: uuidv4(),
    productType,
    name: 'Product Name',
    description: 'Product Description',
    acquisitionDate: subDays(new Date(), getRandomNumber(1, 365)).toISOString(),
    supplier: `Supplier ${getRandomNumber(1, 10)}`,
    cost: getRandomNumber(100, 10000),
    price: getRandomNumber(200, 20000),
    markup: getRandomNumber(1.5, 3),
    storageLocation: `Location ${getRandomItem(['A', 'B', 'C'])}-${getRandomNumber(1, 100)}`,
    condition: getRandomItem<Condition>(['New', 'Used', 'Antique']),
    reservationStatus: getRandomItem<ReservationStatus>(['Available', 'Reserved', 'Sold']),
    seoTitle: 'SEO Title',
    seoDescription: 'SEO Description',
    tags: ['tag1', 'tag2'],
    categoryHierarchy: 'Category > Subcategory',
    images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    videos: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    platformIds: {
      shopifyId: `sh_${uuidv4()}`,
      etsyId: `et_${uuidv4()}`,
    },
    auditTrail: [],
    insuranceValue: getRandomNumber(200, 20000),
    taxCategory: 'Standard',
  };
};

const generateLooseGemstone = (): LooseGemstone => {
  const base = generateBaseProduct('LooseStone');
  return {
    ...base,
    name: `Loose ${getRandomItem(['Diamond', 'Ruby', 'Sapphire'])}`,
    gemstoneType: getRandomItem(['Diamond', 'Ruby', 'Sapphire']),
    variety: 'Variety',
    origin: 'Origin',
    creationMethod: getRandomItem<CreationMethod>(['Natural', 'Lab-Grown']),
    certificationId: `GIA-${getRandomNumber(100000, 999999)}`,
    caratWeight: getRandomNumber(0.5, 5),
    dimensions: `${getRandomNumber(3, 10)}x${getRandomNumber(3, 10)}x${getRandomNumber(2, 8)} mm`,
    shape: 'Round',
    cutGrade: 'Excellent',
    colorGrade: 'D',
    clarityGrade: getRandomItem<ClarityGrade>(['FL', 'IF', 'VVS1']),
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Excellent',
    quantity: 1,
    lotNumber: `LOT-${getRandomNumber(100, 999)}`,
  };
};

const generateCarvedIdol = (): CarvedIdol => {
  const base = generateBaseProduct('CarvedIdol');
  return {
    ...base,
    name: `Carved ${getRandomItem(['Ganesha', 'Buddha'])} Idol`,
    material: 'Jade',
    culturalSignificance: 'Religious',
    deityFigure: getRandomItem(['Ganesha', 'Buddha']),
    carvingStyle: getRandomItem<CarvingStyle>(['Traditional', 'Modern']),
    origin: 'India',
    dimensions: `${getRandomNumber(5, 20)}x${getRandomNumber(5, 20)}x${getRandomNumber(5, 20)} cm`,
    weight: getRandomNumber(0.1, 5),
    finishType: getRandomItem<FinishType>(['Polished', 'Matte']),
    carvingDetailLevel: 'High',
    baseIncluded: true,
    colorDescription: 'Green',
    artisan: 'Artisan Name',
    carvingTechnique: 'Hand-carved',
    agePeriod: '21st Century',
    rarity: getRandomItem<Rarity>(['Rare', 'Unique']),
    workmanshipGrade: getRandomItem<WorkmanshipGrade>(['Excellent', 'Masterpiece']),
  };
};

const generateJewelryItem = (): JewelryItem => {
  const base = generateBaseProduct('Jewelry');
  return {
    ...base,
    name: `${getRandomItem(['Diamond', 'Ruby'])} Ring`,
    category: 'Ring',
    style: 'Solitaire',
    brand: 'Brand Name',
    collection: 'Collection Name',
    metal: 'Gold',
    metalPurity: '18K',
    metalWeight: getRandomNumber(2, 10),
    metalColor: 'Yellow',
    hallmark: '18K',
    plating: 'None',
    gemstones: [
      {
        type: 'Diamond',
        caratWeight: getRandomNumber(0.5, 2),
        settingType: 'Prong',
        quality: 'VS1',
      },
    ],
    ringSize: 7,
    length: undefined,
    adjustable: false,
    sizeRange: undefined,
    laborCost: getRandomNumber(100, 1000),
    warranty: 'Lifetime',
  };
};

export const generateMockProducts = (count: number): AnyProduct[] => {
  const products: AnyProduct[] = [];
  for (let i = 0; i < count; i++) {
    const type = getRandomItem<ProductType>(['LooseStone', 'CarvedIdol', 'Jewelry']);
    if (type === 'LooseStone') {
      products.push(generateLooseGemstone());
    } else if (type === 'CarvedIdol') {
      products.push(generateCarvedIdol());
    } else {
      products.push(generateJewelryItem());
    }
  }
  return products;
};

export const mockProducts = generateMockProducts(50);