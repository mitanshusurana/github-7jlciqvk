// ===================================================================
// Base Product Interface & Core Types
// ===================================================================

export type StockStatus = 'In Stock' | 'Out of Stock' | 'Made-to-Order' | 'On Hold';

export interface AuditEvent {
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, { before: any; after: any }>;
}

/**
 * A base interface for all products. Contains fields common to all items.
 */
export interface Product {
  id: string; // Unique identifier (SKU)
  name: string;
  shortDescription?: string;
  detailedDescription?: string;
  images: string[];
  video?: string;
  qrCode?: string;
  tags?: string[];
  collection?: string; // e.g., "Elsa Peretti", "BlueStone Man"
  certification?: string[]; // e.g., ["BIS", "IGI"]
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy: string;
  auditTrail: AuditEvent[];

  // Common e-commerce fields
  mrp?: number;
  sellingPrice?: number;
  discountLabel?: string;
  stockStatus?: StockStatus | string;
  deliveryTimeEstimate?: string;
  customOrderAvailable?: boolean;
  bulkInquiryEnabled?: boolean;
  clientId?: string;
}

// ===================================================================
// Gemstone & Metal Specific Enums and Types
// ===================================================================

// As per Vedic literature (Navaratna)
export type PreciousGemType =
  | 'Ruby' // Sun
  | 'Pearl' // Moon
  | 'Red Coral' // Mars
  | 'Emerald' // Mercury
  | 'Yellow Sapphire' // Jupiter
  | 'Diamond' // Venus
  | 'Blue Sapphire' // Saturn
  | 'Hessonite' // Rahu
  | "Cat's Eye"; // Ketu

export type SemiPreciousGemType =
  | 'Agate'
  | 'Alexandrite'
  | 'Amazonite'
  | 'Amber'
  | 'Amethyst'
  | 'Ametrine'
  | 'Andalusite'
  | 'Apatite'
  | 'Aquamarine'
  | 'Aventurine'
  | 'Azurite'
  | 'Bloodstone'
  | 'Carnelian'
  | 'Chalcedony'
  | 'Charoite'
  | 'Chrysocolla'
  | 'Chrysoprase'
  | 'Citrine'
  | 'Coral'
  | 'Cordierite'
  | 'Demantoid Garnet'
  | 'Diopside'
  | 'Dumortierite'
  | 'Fluorite'
  | 'Garnet'
  | 'Heliodor'
  | 'Hematite'
  | 'Hemimorphite'
  | 'Howlite'
  | 'Iolite'
  | 'Jadeite'
  | 'Jasper'
  | 'Kunzite'
  | 'Kyanite'
  | 'Labradorite'
  | 'Lapis Lazuli'
  | 'Larimar'
  | 'Lepidolite'
  | 'Malachite'
  | 'Moonstone'
  | 'Morganite'
  | 'Nephrite'
  | 'Obsidian'
  | 'Onyx'
  | 'Opal'
  | 'Peridot'
  | 'Prehnite'
  | 'Pyrite'
  | 'Quartz'
  | 'Rhodochrosite'
  | 'Rhodonite'
  | 'Rose Quartz'
  | 'Seraphinite'
  | 'Serpentine'
  | 'Smoky Quartz'
  | 'Sodalite'
  | 'Spinel'
  | 'Sunstone'
  | 'Tanzanite'
  | 'Tiger\'s Eye'
  | 'Topaz'
  | 'Tourmaline'
  | 'Turquoise'
  | 'Zircon'
  | 'Other';

export type OrganicGemType = 'Pearl' | 'Amber' | 'Coral' | 'Jet' | 'Ivory' | 'Shell' | 'Other';

export type PreciousMetalType = 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Rhodium' | 'Iridium' | 'Other';

export type Shape = 'Round' | 'Princess' | 'Emerald' | 'Asscher' | 'Marquise' | 'Oval' | 'Radiant' | 'Pear' | 'Heart' | 'Cushion' | 'Other';
export type Transparency = 'Transparent' | 'Translucent' | 'Opaque';
export type Lustre = 'Vitreous' | 'Resinous' | 'Pearly' | 'Greasy' | 'Silky' | 'Waxy' | 'Dull' | 'Metallic';
export type DesignType = 'Antique' | 'Modern' | 'Temple' | 'Classic' | 'Contemporary' | 'Ethnic' | 'Other';
export type Occasion = 'Bridal' | 'Daily Wear' | 'Festive' | 'Gift' | 'Work Wear' | 'Party Wear' | 'Other';
export type AntiqueEra = 'Pre-1800s' | 'Victorian (1837-1901)' | 'Art Nouveau (1890-1910)' | 'Edwardian (1901-1910)' | 'Art Deco (1920-1935)' | 'Retro (1935-1950)' | 'Mid-Century (1950s)' | 'Modern (Post-1960)' | 'Other';
export type RegionalStyle = 'Rajasthani' | 'South Indian' | 'Mughal' | 'Nizami' | 'Pahari' | 'Other';

// ===================================================================
// Specialized Product Interfaces
// ===================================================================

/**
 * For loose, individual gemstones.
 */
export interface LooseStone extends Product {
  productType: 'LooseStone';
  category: 'Precious Gemstones' | 'Semi-Precious Gemstones' | 'Organic Gems';
  subCategory: PreciousGemType | SemiPreciousGemType | OrganicGemType | string;
  weight: number; // in carats
  dimensions: { length: number; width: number; height: number }; // in mm
  color: string;
  clarity: string;
  cut: string;
  shape: Shape | string;
  origin: string;
  treatment: string;
  treatmentDetails?: string;
  zodiacRelevance?: string;
}

/**
 * For rough, uncut stones.
 */
export interface RoughStone extends Product {
  productType: 'RoughStone';
  category: 'Precious Gemstones' | 'Semi-Precious Gemstones';
  subCategory: PreciousGemType | SemiPreciousGemType | string;
  weight: number; // in grams
  origin: string;
  notes?: string;
}

/**
 * For finished jewelry pieces.
 */
export interface Jewelry extends Product {
  productType: 'Jewelry';
  itemType: 'Ring' | 'Necklace' | 'Bracelet' | 'Earrings' | 'Pendant' | 'Brooch' | 'Carved Idol' | 'Antique Piece' | 'Custom Jewelry' | 'Watch' | 'Cufflinks' | 'Other';
  idolAttribute?: string;
  designer?: string; // e.g., "Elsa Peretti"
  designType?: DesignType | string;
  occasion?: Occasion | string;

  // Metal details
  metalType: PreciousMetalType | string;
  purity?: string;
  metalWeight?: number; // in grams

  // Gemstone details
  gemstones: {
    stone: PreciousGemType | SemiPreciousGemType | OrganicGemType | string;
    weight: number; // carats
    stoneCount: number;
    clarity?: string;
    cut?: string;
    shape?: Shape | string;
    stoneSize?: string; // e.g., "2.5 mm"
    settingType?: string; // e.g., "Prong"
    diamondQuality?: string; // e.g., "SI IJ"
  }[];
  totalCaratWeight?: number;

  // Jewelry specific details
  ringSize?: string;

  // Antique details
  antiqueEra?: AntiqueEra | string;
  regionalStyle?: RegionalStyle | string;

  // Craftsmanship
  materialComposition?: string;
  craftsmanshipDetail?: string;
  artisanOrWorkshop?: string;
}

/**
 * For precious metals in raw form.
 */
export interface Metal extends Product {
  productType: 'Metal';
  itemType: 'Metal Bar/Ingot' | 'Metal Sheet' | 'Metal Wire';
  metalType: PreciousMetalType | string;
  purity: string;
  weight: number; // in grams
}

// A union type for all product types, to be used in the application
export type AnyProduct = LooseStone | RoughStone | Jewelry | Metal;

// Other existing interfaces
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

export interface PaginatedProducts {
  content: AnyProduct[];
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
  recentAdditions: AnyProduct[];
  totalValue: number;
  valueByCategory: Record<string, number>;
}

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