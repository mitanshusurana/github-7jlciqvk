// ===================================================================
// System-Wide Enums and Core Types
// ===================================================================

export type ProductType = 'LooseStone' | 'CarvedIdol' | 'Jewelry';

export type CreationMethod = 'Natural' | 'Lab-Grown';

export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';

export type Condition = 'New' | 'Used' | 'Antique';

export type ReservationStatus = 'Available' | 'Reserved' | 'Sold';

export type FinishType = 'Polished' | 'Matte' | 'Brushed' | 'Hammered';

export type CarvingStyle = 'Traditional' | 'Modern' | 'Abstract';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Unique';

export type WorkmanshipGrade = 'Standard' | 'Fine' | 'Excellent' | 'Masterpiece';

export type JewelryCategory = 'Ring' | 'Necklace' | 'Bracelet' | 'Earrings' | 'Pendant' | 'Brooch' | 'Other';

export type JewelryStyle = 'Solitaire' | 'Halo' | 'Vintage' | 'Modern' | 'Three-Stone';

export type Metal = 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Titanium' | 'Tungsten';

export type Hallmark = '925' | '10K' | '14K' | '18K' | 'PT950';

export type SettingType = 'Prong' | 'Bezel' | 'Pave' | 'Channel' | 'Invisible';

export type Warranty = 'None' | '1-Year' | 'Lifetime';

export type ABCClassification = 'A' | 'B' | 'C';

// ===================================================================
// Base Product Interface
// ===================================================================

export interface BaseProduct {
  // Core Attributes
  id: string; // Unique SKU
  productType: ProductType;
  name: string;
  description: string;

  // Business Attributes
  acquisitionDate: string;
  supplier: string;
  cost: number;
  price: number;
  markup: number;
  storageLocation: string;
  condition: Condition;
  reservationStatus: ReservationStatus;

  // E-commerce Fields
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  categoryHierarchy: string;

  // Media
  images: string[];
  videos: string[];

  // System Integration
  platformIds: {
    shopifyId?: string;
    etsyId?: string;
    ebayId?: string;
    amazonId?: string;
    googleShoppingId?: string;
  };

  // Audit and Compliance
  auditTrail: any[]; // Define a proper audit trail interface later
  insuranceValue: number;
  appraisalDate?: string;
  taxCategory: string;

  // Inventory
  inventoryQuantity?: number;
  reorderThreshold?: number;
}

// ===================================================================
// Loose Gemstone Interface (30 fields)
// ===================================================================

export interface LooseGemstone extends BaseProduct {
  productType: 'LooseStone';

  // Core Attributes
  gemstoneType: string; // e.g., Diamond, Ruby
  variety: string;
  origin: string;
  creationMethod: CreationMethod;
  certificationId: string;

  // Physical Characteristics
  caratWeight: number;
  dimensions: string; // e.g., "10x8x5 mm"
  shape: string;
  cutGrade: string;
  colorGrade: string;
  clarityGrade: ClarityGrade;
  fluorescence: string;
  polish: string;
  symmetry: string;

  // Inventory Tracking
  quantity: number;
  lotNumber: string;
}

// ===================================================================
// Carved Gemstone Idol Interface (25 fields)
// ===================================================================

export interface CarvedIdol extends BaseProduct {
  productType: 'CarvedIdol';

  // Core Attributes
  material: string;
  culturalSignificance: string;
  deityFigure: string;
  carvingStyle: CarvingStyle;
  origin: string;

  // Physical Specifications
  dimensions: string;
  weight: number;
  finishType: FinishType;
  carvingDetailLevel: string;
  baseIncluded: boolean;
  colorDescription: string;

  // Artistic Attributes
  artisan: string;
  carvingTechnique: string;
  agePeriod: string;
  rarity: Rarity;
  workmanshipGrade: WorkmanshipGrade;
}

// ===================================================================
// Jewelry Item Interface (33 fields)
// ===================================================================

export interface JewelryItem extends BaseProduct {
  productType: 'Jewelry';

  // Core Attributes
  category: JewelryCategory;
  style: JewelryStyle;
  brand?: string;
  collection?: string;

  // Metal Specifications
  metal: Metal;
  metalPurity: string;
  metalWeight: number;
  metalColor: string;
  hallmark?: Hallmark;
  plating?: string;

  // Gemstone Details
  gemstones: {
    type: string;
    caratWeight: number;
    settingType: SettingType;
    quality: string;
  }[];

  // Sizing Information
  ringSize?: number;
  length?: number;
  adjustable: boolean;
  sizeRange?: string;

  // Business Information
  laborCost: number;
  warranty: Warranty;
}

// ===================================================================
// Union Type for Any Product
// ===================================================================

export type AnyProduct = LooseGemstone | CarvedIdol | JewelryItem;

// ===================================================================
// Other Interfaces
// ===================================================================

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  style?: string;
  metal?: string;
  clarityGrade?: ClarityGrade;
  rarity?: Rarity;
  workmanshipGrade?: WorkmanshipGrade;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'weight' | 'value';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProducts {
  content: AnyProduct[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  total?: number;
}

export interface Movement {
  id: string;
  productId: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  userId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}