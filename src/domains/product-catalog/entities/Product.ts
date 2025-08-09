// ===================================================================
// Product Catalog Domain - Core Product Entity
// ===================================================================

import { AggregateRoot, Money, Status, AuditTrail } from '../../shared/types';

export enum ProductType {
  LOOSE_GEMSTONE = 'LOOSE_GEMSTONE',
  CARVED_IDOL = 'CARVED_IDOL', 
  JEWELRY = 'JEWELRY'
}

export enum ReservationStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  ON_HOLD = 'ON_HOLD'
}

export enum Condition {
  NEW = 'NEW',
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  ANTIQUE = 'ANTIQUE',
  VINTAGE = 'VINTAGE'
}

export class ProductId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }
  }

  toString(): string {
    return this.value;
  }
}

export class SKU {
  constructor(public readonly value: string) {
    if (!value || !this.isValidSKU(value)) {
      throw new Error('Invalid SKU format');
    }
  }

  private isValidSKU(sku: string): boolean {
    // SKU format: PREFIX-YYYY-SEQUENCE (e.g., GEM-2024-001234)
    const skuRegex = /^[A-Z]{2,4}-\d{4}-\d{6}$/;
    return skuRegex.test(sku);
  }

  toString(): string {
    return this.value;
  }
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
}

export interface PlatformIds {
  shopifyId?: string;
  etsyId?: string;
  ebayId?: string;
  amazonId?: string;
  googleShoppingId?: string;
  customWebsiteId?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | '360_view' | 'certificate';
  title?: string;
  altText?: string;
  sortOrder: number;
  isPrimary?: boolean;
}

export abstract class Product implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: ProductId,
    public readonly sku: SKU,
    public readonly productType: ProductType,
    public name: string,
    public description: string,
    public shortDescription?: string,
    public status: Status = Status.ACTIVE,
    public reservationStatus: ReservationStatus = ReservationStatus.AVAILABLE,
    public condition: Condition = Condition.NEW,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Business Attributes
  public acquisitionDate?: Date;
  public supplier?: string;
  public supplierReference?: string;
  public cost?: Money;
  public retailPrice?: Money;
  public markupPercentage?: number;
  public storageLocation?: string;

  // SEO and Marketing
  public seoData?: SEOData;
  public tags: string[] = [];
  public categoryHierarchy?: string;
  public brand?: string;
  public collection?: string;

  // Media Management
  public mediaAssets: MediaAsset[] = [];

  // Platform Integration
  public platformIds: PlatformIds = {};

  // Compliance and Insurance
  public insuranceValue?: Money;
  public appraisalDate?: Date;
  public appraisalValue?: Money;
  public taxCategory?: string;
  public exportCode?: string;

  // Audit Trail
  public auditTrail: AuditTrail[] = [];

  // Abstract methods to be implemented by specific product types
  abstract getSpecificationType(): string;
  abstract validateBusinessRules(): boolean;
  abstract calculateBasePrice(): Money;

  // Common business methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    this.name = newName;
    this.updatedAt = new Date();
    this.version++;
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription;
    this.updatedAt = new Date();
    this.version++;
  }

  reserve(): void {
    if (this.reservationStatus !== ReservationStatus.AVAILABLE) {
      throw new Error('Product is not available for reservation');
    }
    this.reservationStatus = ReservationStatus.RESERVED;
    this.updatedAt = new Date();
    this.version++;
  }

  makeAvailable(): void {
    if (this.reservationStatus === ReservationStatus.SOLD) {
      throw new Error('Cannot make sold product available');
    }
    this.reservationStatus = ReservationStatus.AVAILABLE;
    this.updatedAt = new Date();
    this.version++;
  }

  markAsSold(): void {
    this.reservationStatus = ReservationStatus.SOLD;
    this.status = Status.INACTIVE;
    this.updatedAt = new Date();
    this.version++;
  }

  updatePricing(cost?: Money, retailPrice?: Money, markupPercentage?: number): void {
    if (cost) this.cost = cost;
    if (retailPrice) this.retailPrice = retailPrice;
    if (markupPercentage !== undefined) this.markupPercentage = markupPercentage;
    
    // Validate pricing consistency
    if (this.cost && this.retailPrice && this.markupPercentage) {
      const expectedPrice = this.cost.multiply(1 + this.markupPercentage / 100);
      if (!expectedPrice.equals(this.retailPrice)) {
        throw new Error('Pricing values are inconsistent');
      }
    }
    
    this.updatedAt = new Date();
    this.version++;
  }

  addMediaAsset(asset: MediaAsset): void {
    // Ensure only one primary image
    if (asset.isPrimary) {
      this.mediaAssets.forEach(a => a.isPrimary = false);
    }
    
    this.mediaAssets.push(asset);
    this.updatedAt = new Date();
    this.version++;
  }

  removeMediaAsset(assetId: string): void {
    this.mediaAssets = this.mediaAssets.filter(a => a.id !== assetId);
    this.updatedAt = new Date();
    this.version++;
  }

  updatePlatformId(platform: keyof PlatformIds, id: string): void {
    this.platformIds[platform] = id;
    this.updatedAt = new Date();
    this.version++;
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  updateSEOData(seoData: SEOData): void {
    this.seoData = seoData;
    this.updatedAt = new Date();
    this.version++;
  }

  getPrimaryImage(): MediaAsset | undefined {
    return this.mediaAssets.find(a => a.isPrimary && a.type === 'image');
  }

  getImages(): MediaAsset[] {
    return this.mediaAssets.filter(a => a.type === 'image');
  }

  getVideos(): MediaAsset[] {
    return this.mediaAssets.filter(a => a.type === 'video');
  }

  getCertificates(): MediaAsset[] {
    return this.mediaAssets.filter(a => a.type === 'certificate');
  }

  isAvailableForSale(): boolean {
    return this.status === Status.ACTIVE && 
           this.reservationStatus === ReservationStatus.AVAILABLE;
  }

  hasValidPricing(): boolean {
    return this.retailPrice !== undefined && this.retailPrice.amount > 0;
  }

  // Calculate markup if cost and retail price are available
  calculateMarkup(): number | undefined {
    if (!this.cost || !this.retailPrice) return undefined;
    return ((this.retailPrice.amount - this.cost.amount) / this.cost.amount) * 100;
  }
}
