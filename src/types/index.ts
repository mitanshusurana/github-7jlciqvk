export interface Gemstone {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  itemType: string;
  type: string;
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
  certification: string;
  acquisitionDate?: string; // Made optional
  acquisitionPrice?: number;
  estimatedValue?: number;
  seller?: string;
  notes: string;
  tags: string[];
  images: string[]; // URLs to images
  video?: string; // URL to video
  qrCode: string; // URL or data for QR code
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy: string;
  auditTrail: AuditEvent[];
  
  // Item-specific details
  itemSpecificDetails: {
    // For metals
    purity?: string; // e.g., "24K", "18K", "925 Sterling"
    metalType?: string; // e.g., "Gold", "Silver", "Platinum"
    
    // For gemstone lots
    numberOfPieces?: number;
    totalWeight?: number;
    averageWeight?: number;
    
    // For jewelry
    size?: string; // Ring size, chain length, etc.
    setting?: string; // Prong, bezel, etc.
    
    // For rough stones
    shape?: string;
    quality?: string;
    
    // For carved items
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