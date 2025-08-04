// Enums for new fields
export type Shape = 'Round' | 'Princess' | 'Emerald' | 'Asscher' | 'Marquise' | 'Oval' | 'Radiant' | 'Pear' | 'Heart' | 'Cushion' | 'Other';
export type Transparency = 'Transparent' | 'Translucent' | 'Opaque';
export type Lustre = 'Vitreous' | 'Resinous' | 'Pearly' | 'Greasy' | 'Silky' | 'Waxy' | 'Dull' | 'Metallic';
export type DesignType = 'Antique' | 'Modern' | 'Temple' | 'Classic' | 'Contemporary' | 'Ethnic' | 'Other';
export type Occasion = 'Bridal' | 'Daily Wear' | 'Festive' | 'Gift' | 'Work Wear' | 'Party Wear' | 'Other';
export type StockStatus = 'In Stock' | 'Out of Stock' | 'Made-to-Order' | 'On Hold';
export type AntiqueEra = 'Pre-1800s' | 'Victorian (1837-1901)' | 'Art Nouveau (1890-1910)' | 'Edwardian (1901-1910)' | 'Art Deco (1920-1935)' | 'Retro (1935-1950)' | 'Mid-Century (1950s)' | 'Modern (Post-1960)' | 'Other';
export type RegionalStyle = 'Rajasthani' | 'South Indian' | 'Mughal' | 'Nizami' | 'Pahari' | 'Other';

export interface Gemstone {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  itemType: string;

  // Retained Original Fields
  weight: number; // in carats for gemstones, grams for metals
  dimensions: {
    length: number; // in mm
    width: number; // in mm
    height: number; // in mm
  };
  color: string;
  clarity: string;
  cut: string;
  origin: string;
  treatment: string;
  certification: string; // Certification No.
  acquisitionDate?: string;
  acquisitionPrice?: number;
  seller?: string;
  estimatedValue?: number;
  notes: string;
  images: string[];
  video?: string;
  qrCode: string;

  // Consolidated and Renamed Fields
  shape?: Shape | string;
  gemVariety?: string; // Replaces 'type' for clarity
  stoneCount?: number; // Replaces itemSpecificDetails.numberOfPieces
  ringSize?: string; // Replaces itemSpecificDetails.size
  totalCaratWeight?: number; // Replaces itemSpecificDetails.totalWeight for jewelry

  // A. Visual & Descriptive
  shortDescription?: string;
  detailedDescription?: string;
  transparency?: Transparency | string;
  lustre?: Lustre | string;
  designType?: DesignType | string;
  occasion?: Occasion | string;

  // B. Trust-Building & Info Transparency
  treatmentDetails?: string;
  certificationUpload?: string; // URL to certificate image/PDF
  returnPolicy?: string;
  warrantyInfo?: string;
  careInstructions?: string;
  zodiacRelevance?: string;
  inTheBox?: string[];

  // C. E-Commerce Ready
  mrp?: number;
  sellingPrice?: number;
  discountLabel?: string;
  stockStatus?: StockStatus | string;
  deliveryTimeEstimate?: string;
  customOrderAvailable?: boolean;
  bulkInquiryEnabled?: boolean;

  // D. Antique & Heritage Jewelry Additions
  antiqueEra?: AntiqueEra | string;
  regionalStyle?: RegionalStyle | string;
  materialComposition?: string; // E.g., "22K Gold, Uncut Diamonds, Emeralds"
  craftsmanshipDetail?: string;
  artisanOrWorkshop?: string;

  // Original metadata
  tags: string[];
  createdAt: string;
  updatedAt:string;
  createdBy: string;
  lastEditedBy: string;
  auditTrail: AuditEvent[];

  // Deprecating itemSpecificDetails in favor of top-level optional fields
  itemSpecificDetails?: {
    purity?: string;
    metalType?: string;
    averageWeight?: number;
    setting?: string;
    quality?: string;
    carving?: string;
    artisan?: string;
    style?: string;
  };
}

export interface AuditEvent {
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, { before: any; after: any }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface MediaUpload {
  file: File;
  progress: number;
  url?: string;
  error?: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
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
  subCategory?: string;
  itemType?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  occasion?: string;
  designType?: string;
  stockStatus?: string;
  materialComposition?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'weight' | 'value';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedGemstones {
  content: Gemstone[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  total?: number;
}

export interface AnalyticsData {
  totalItems: number;
  itemsByCategory: Record<string, number>;
  itemsByType: Record<string, number>;
  recentAdditions: Gemstone[];
  totalValue: number;
  valueByCategory: Record<string, number>;
}

// Updated categories for precious/semi-precious dealers
export type Category = 
  | 'Precious Gemstones' 
  | 'Semi-Precious Gemstones' 
  | 'Precious Metals'
  | 'Organic Gems';

// Item types for different business categories
export type ItemType =
  | 'Loose Gemstone'
  | 'Gemstone Lot'
  | 'Ring'
  | 'Necklace'
  | 'Bracelet'
  | 'Earrings'
  | 'Pendant'
  | 'Brooch'
  | 'Carved Idol'
  | 'Rough Stone'
  | 'Metal Bar/Ingot'
  | 'Metal Sheet'
  | 'Metal Wire'
  | 'Antique Piece'
  | 'Custom Jewelry'
  | 'Watch'
  | 'Cufflinks'
  | 'Other';

// Precious gemstones (The Big 4 + 5 others)
export type PreciousGemType =
  | 'Diamond'
  | 'Ruby'
  | 'Sapphire'
  | 'Emerald'
  | 'Tanzanite'
  | 'Paraiba Tourmaline'
  | 'Jadeite'
  | 'Red Beryl'
  | 'Taaffeite';

// Semi-precious gemstones
export type SemiPreciousGemType =
  | 'Amethyst'
  | 'Aquamarine'
  | 'Citrine'
  | 'Garnet'
  | 'Peridot'
  | 'Topaz'
  | 'Tourmaline'
  | 'Spinel'
  | 'Moonstone'
  | 'Labradorite'
  | 'Amazonite'
  | 'Aventurine'
  | 'Carnelian'
  | 'Chalcedony'
  | 'Chrysoprase'
  | 'Jasper'
  | 'Onyx'
  | 'Agate'
  | 'Quartz'
  | 'Rose Quartz'
  | 'Smoky Quartz'
  | 'Tiger Eye'
  | 'Turquoise'
  | 'Lapis Lazuli'
  | 'Malachite'
  | 'Sodalite'
  | 'Fluorite'
  | 'Iolite'
  | 'Kyanite'
  | 'Andalusite'
  | 'Other';

// Organic gems
export type OrganicGemType =
  | 'Pearl'
  | 'Amber'
  | 'Coral'
  | 'Jet'
  | 'Ivory'
  | 'Shell'
  | 'Other';

// Precious metals
export type PreciousMetalType =
  | 'Gold'
  | 'Silver'
  | 'Platinum'
  | 'Palladium'
  | 'Rhodium'
  | 'Iridium'
  | 'Other';