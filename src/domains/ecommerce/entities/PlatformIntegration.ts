// ===================================================================
// E-commerce Integration Domain
// ===================================================================

import { AggregateRoot, Money } from '../../shared/types';
import { ProductId } from '../../product-catalog/entities/Product';

export enum Platform {
  SHOPIFY = 'SHOPIFY',
  ETSY = 'ETSY',
  EBAY = 'EBAY',
  AMAZON = 'AMAZON',
  GOOGLE_SHOPPING = 'GOOGLE_SHOPPING',
  FACEBOOK_MARKETPLACE = 'FACEBOOK_MARKETPLACE',
  INSTAGRAM_SHOPPING = 'INSTAGRAM_SHOPPING',
  CUSTOM_WEBSITE = 'CUSTOM_WEBSITE'
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  SOLD = 'SOLD',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  SUSPENDED = 'SUSPENDED'
}

export enum SyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  CONFLICT = 'CONFLICT',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export interface PlatformSpecificData {
  title: string;
  description: string;
  shortDescription?: string;
  categories: string[];
  tags: string[];
  customFields?: Record<string, any>;
  seoData?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface PricingStrategy {
  basePrice: Money;
  platformMarkup?: number; // Additional markup for this platform
  minimumPrice?: Money;
  maximumPrice?: Money;
  competitorPricing?: Money;
  dynamicPricing?: boolean;
  priceRules?: PriceRule[];
}

export interface PriceRule {
  id: string;
  name: string;
  condition: string; // e.g., "inventory < 5"
  action: string; // e.g., "increase_price_10_percent"
  active: boolean;
}

export interface ShippingConfiguration {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'inches' | 'cm';
  };
  shippingClass?: string;
  freeShippingThreshold?: Money;
  shippingMethods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: Money;
  estimatedDays: number;
  trackingAvailable: boolean;
  insuranceIncluded: boolean;
  restrictions?: string[];
}

export interface InventorySync {
  syncEnabled: boolean;
  reserveQuantity?: number; // Quantity to reserve on this platform
  oversellProtection: boolean;
  lowStockThreshold?: number;
  autoRestock?: boolean;
}

export interface MarketingConfiguration {
  promotionalPrice?: Money;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  featuredListing?: boolean;
  sponsoredAds?: boolean;
  socialMediaIntegration?: boolean;
  emailMarketing?: boolean;
}

export interface AnalyticsData {
  views: number;
  favorites: number;
  clicks: number;
  conversions: number;
  revenue: Money;
  averageOrderValue: Money;
  returnRate: number;
  customerSatisfaction?: number;
  lastUpdated: Date;
}

export class PlatformListing implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    public readonly productId: ProductId,
    public readonly platform: Platform,
    public readonly platformProductId: string,
    public listingStatus: ListingStatus = ListingStatus.DRAFT,
    public syncStatus: SyncStatus = SyncStatus.PENDING,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Platform-specific content
  public platformData?: PlatformSpecificData;
  public pricingStrategy?: PricingStrategy;
  public shippingConfig?: ShippingConfiguration;
  public inventorySync?: InventorySync;
  public marketingConfig?: MarketingConfiguration;

  // Analytics and performance
  public analytics?: AnalyticsData;
  public lastSyncDate?: Date;
  public syncErrors: string[] = [];

  // Platform-specific URLs
  public listingUrl?: string;
  public adminUrl?: string;

  // Business methods
  updateListingStatus(status: ListingStatus): void {
    this.listingStatus = status;
    this.updatedAt = new Date();
    this.version++;
  }

  updateSyncStatus(status: SyncStatus, error?: string): void {
    this.syncStatus = status;
    if (error) {
      this.syncErrors.push(error);
    } else {
      this.syncErrors = []; // Clear errors on successful sync
    }
    this.lastSyncDate = new Date();
    this.updatedAt = new Date();
    this.version++;
  }

  updatePlatformData(data: PlatformSpecificData): void {
    this.platformData = data;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  updatePricing(strategy: PricingStrategy): void {
    this.pricingStrategy = strategy;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  updateShippingConfig(config: ShippingConfiguration): void {
    this.shippingConfig = config;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  updateInventorySync(config: InventorySync): void {
    this.inventorySync = config;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  updateMarketingConfig(config: MarketingConfiguration): void {
    this.marketingConfig = config;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  updateAnalytics(data: AnalyticsData): void {
    this.analytics = data;
    this.updatedAt = new Date();
    this.version++;
  }

  addSyncError(error: string): void {
    this.syncErrors.push(error);
    this.syncStatus = SyncStatus.ERROR;
    this.updatedAt = new Date();
    this.version++;
  }

  clearSyncErrors(): void {
    this.syncErrors = [];
    this.updatedAt = new Date();
    this.version++;
  }

  activate(): void {
    if (this.syncStatus !== SyncStatus.SYNCED) {
      throw new Error('Cannot activate listing that is not synced');
    }
    this.listingStatus = ListingStatus.ACTIVE;
    this.updatedAt = new Date();
    this.version++;
  }

  deactivate(): void {
    this.listingStatus = ListingStatus.INACTIVE;
    this.syncStatus = SyncStatus.PENDING;
    this.updatedAt = new Date();
    this.version++;
  }

  markAsSold(): void {
    this.listingStatus = ListingStatus.SOLD;
    this.updatedAt = new Date();
    this.version++;
  }

  // Helper methods
  isActive(): boolean {
    return this.listingStatus === ListingStatus.ACTIVE;
  }

  isSynced(): boolean {
    return this.syncStatus === SyncStatus.SYNCED;
  }

  hasErrors(): boolean {
    return this.syncErrors.length > 0;
  }

  needsSync(): boolean {
    return this.syncStatus === SyncStatus.PENDING;
  }

  getEffectivePrice(): Money {
    if (!this.pricingStrategy) {
      throw new Error('Pricing strategy not configured');
    }

    let price = this.pricingStrategy.basePrice;

    // Apply platform markup
    if (this.pricingStrategy.platformMarkup) {
      price = price.multiply(1 + this.pricingStrategy.platformMarkup / 100);
    }

    // Apply promotional pricing
    if (this.marketingConfig?.promotionalPrice &&
        this.isPromotionActive()) {
      price = this.marketingConfig.promotionalPrice;
    }

    // Ensure within min/max bounds
    if (this.pricingStrategy.minimumPrice && 
        price.amount < this.pricingStrategy.minimumPrice.amount) {
      price = this.pricingStrategy.minimumPrice;
    }

    if (this.pricingStrategy.maximumPrice && 
        price.amount > this.pricingStrategy.maximumPrice.amount) {
      price = this.pricingStrategy.maximumPrice;
    }

    return price;
  }

  private isPromotionActive(): boolean {
    if (!this.marketingConfig?.promotionStartDate || 
        !this.marketingConfig?.promotionEndDate) {
      return false;
    }

    const now = new Date();
    return now >= this.marketingConfig.promotionStartDate && 
           now <= this.marketingConfig.promotionEndDate;
  }

  getConversionRate(): number {
    if (!this.analytics || this.analytics.clicks === 0) return 0;
    return this.analytics.conversions / this.analytics.clicks;
  }

  getROI(): number {
    if (!this.analytics || !this.pricingStrategy) return 0;
    
    const revenue = this.analytics.revenue.amount;
    const cost = this.pricingStrategy.basePrice.amount * this.analytics.conversions;
    
    if (cost === 0) return 0;
    
    return ((revenue - cost) / cost) * 100;
  }

  getPerformanceScore(): number {
    let score = 0;
    
    if (this.analytics) {
      // Views contribution (0-25 points)
      if (this.analytics.views > 1000) score += 25;
      else if (this.analytics.views > 500) score += 20;
      else if (this.analytics.views > 100) score += 15;
      else if (this.analytics.views > 50) score += 10;
      else score += 5;
      
      // Conversion rate contribution (0-35 points)
      const conversionRate = this.getConversionRate();
      if (conversionRate > 0.05) score += 35;
      else if (conversionRate > 0.03) score += 25;
      else if (conversionRate > 0.01) score += 15;
      else if (conversionRate > 0.005) score += 10;
      else score += 5;
      
      // Favorites/engagement (0-20 points)
      if (this.analytics.favorites > 100) score += 20;
      else if (this.analytics.favorites > 50) score += 15;
      else if (this.analytics.favorites > 20) score += 10;
      else score += 5;
      
      // Customer satisfaction (0-20 points)
      if (this.analytics.customerSatisfaction) {
        score += this.analytics.customerSatisfaction * 20;
      }
    }
    
    return Math.min(score, 100);
  }
}

// Platform Integration Aggregate Root
export class PlatformIntegration implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    public readonly productId: ProductId,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public listings: Map<Platform, PlatformListing> = new Map();
  public globalSyncEnabled: boolean = true;
  public lastGlobalSync?: Date;

  // Add listing for a platform
  addListing(listing: PlatformListing): void {
    this.listings.set(listing.platform, listing);
    this.updatedAt = new Date();
    this.version++;
  }

  // Remove listing for a platform
  removeListing(platform: Platform): void {
    this.listings.delete(platform);
    this.updatedAt = new Date();
    this.version++;
  }

  // Get listing for a platform
  getListing(platform: Platform): PlatformListing | undefined {
    return this.listings.get(platform);
  }

  // Get all active listings
  getActiveListings(): PlatformListing[] {
    return Array.from(this.listings.values()).filter(l => l.isActive());
  }

  // Get listings that need sync
  getListingsNeedingSync(): PlatformListing[] {
    return Array.from(this.listings.values()).filter(l => l.needsSync());
  }

  // Enable/disable global sync
  setGlobalSync(enabled: boolean): void {
    this.globalSyncEnabled = enabled;
    this.updatedAt = new Date();
    this.version++;
  }

  // Mark global sync completed
  markGlobalSyncCompleted(): void {
    this.lastGlobalSync = new Date();
    this.updatedAt = new Date();
    this.version++;
  }

  // Get total revenue across all platforms
  getTotalRevenue(): Money {
    let total = new Money(0);
    
    for (const listing of this.listings.values()) {
      if (listing.analytics?.revenue) {
        total = total.add(listing.analytics.revenue);
      }
    }
    
    return total;
  }

  // Get best performing platform
  getBestPerformingPlatform(): Platform | undefined {
    let bestPlatform: Platform | undefined;
    let bestScore = 0;
    
    for (const [platform, listing] of this.listings) {
      const score = listing.getPerformanceScore();
      if (score > bestScore) {
        bestScore = score;
        bestPlatform = platform;
      }
    }
    
    return bestPlatform;
  }
}
