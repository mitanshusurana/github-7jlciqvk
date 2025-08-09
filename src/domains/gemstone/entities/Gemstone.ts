// ===================================================================
// Gemstone Domain - Specialized Gemstone Entity
// ===================================================================

import { Product, ProductType, ProductId, SKU } from '../../product-catalog/entities/Product';
import { Money, Weight, Dimensions } from '../../shared/types';

export enum GemstoneType {
  DIAMOND = 'DIAMOND',
  RUBY = 'RUBY',
  SAPPHIRE = 'SAPPHIRE',
  EMERALD = 'EMERALD',
  TANZANITE = 'TANZANITE',
  TOURMALINE = 'TOURMALINE',
  GARNET = 'GARNET',
  AMETHYST = 'AMETHYST',
  CITRINE = 'CITRINE',
  PERIDOT = 'PERIDOT',
  AQUAMARINE = 'AQUAMARINE',
  TOPAZ = 'TOPAZ',
  OPAL = 'OPAL',
  JADE = 'JADE',
  ONYX = 'ONYX',
  AGATE = 'AGATE',
  OTHER = 'OTHER'
}

export enum CreationMethod {
  NATURAL = 'NATURAL',
  LAB_GROWN = 'LAB_GROWN',
  SYNTHETIC = 'SYNTHETIC',
  ENHANCED = 'ENHANCED'
}

export enum ClarityGrade {
  FL = 'FL',     // Flawless
  IF = 'IF',     // Internally Flawless
  VVS1 = 'VVS1', // Very Very Slightly Included 1
  VVS2 = 'VVS2', // Very Very Slightly Included 2
  VS1 = 'VS1',   // Very Slightly Included 1
  VS2 = 'VS2',   // Very Slightly Included 2
  SI1 = 'SI1',   // Slightly Included 1
  SI2 = 'SI2',   // Slightly Included 2
  I1 = 'I1',     // Included 1
  I2 = 'I2',     // Included 2
  I3 = 'I3'      // Included 3
}

export enum CutGrade {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum Shape {
  ROUND = 'ROUND',
  PRINCESS = 'PRINCESS',
  EMERALD = 'EMERALD',
  ASSCHER = 'ASSCHER',
  MARQUISE = 'MARQUISE',
  OVAL = 'OVAL',
  RADIANT = 'RADIANT',
  PEAR = 'PEAR',
  HEART = 'HEART',
  CUSHION = 'CUSHION',
  BAGUETTE = 'BAGUETTE',
  TRILLION = 'TRILLION',
  CABOCHON = 'CABOCHON',
  FREEFORM = 'FREEFORM'
}

export enum Fluorescence {
  NONE = 'NONE',
  FAINT = 'FAINT',
  SLIGHT = 'SLIGHT',
  MEDIUM = 'MEDIUM',
  STRONG = 'STRONG',
  VERY_STRONG = 'VERY_STRONG'
}

export enum PolishGrade {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export enum SymmetryGrade {
  EXCELLENT = 'EXCELLENT',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR'
}

export interface Certification {
  id: string;
  laboratory: string; // GIA, AGS, Gübelin, SSEF, etc.
  certificateNumber: string;
  dateIssued: Date;
  expiryDate?: Date;
  reportUrl?: string;
  verificationUrl?: string;
  notes?: string;
}

export interface GemstoneGrading {
  colorGrade?: string;
  clarityGrade?: ClarityGrade;
  cutGrade?: CutGrade;
  polishGrade?: PolishGrade;
  symmetryGrade?: SymmetryGrade;
  fluorescence?: Fluorescence;
  fluorescenceColor?: string;
}

export interface TreatmentInfo {
  treatments: string[]; // Heat, Oil, Irradiation, etc.
  treatmentDisclosure: string;
  permanence: string;
  detectionMethod?: string;
}

export interface InclusionInfo {
  inclusionType: string[];
  inclusionPosition: string;
  inclusionVisibility: string;
  inclusions: string; // Detailed description
}

export class Gemstone extends Product {
  constructor(
    id: ProductId,
    sku: SKU,
    name: string,
    description: string,
    // Gemstone-specific properties
    public readonly gemstoneType: GemstoneType,
    public readonly variety: string,
    public readonly origin: string,
    public readonly creationMethod: CreationMethod,
    public readonly caratWeight: Weight,
    public readonly dimensions: Dimensions,
    public readonly shape: Shape
  ) {
    super(id, sku, ProductType.LOOSE_GEMSTONE, name, description);
  }

  // Core Gemstone Properties
  public grading?: GemstoneGrading;
  public certification?: Certification;
  public treatment?: TreatmentInfo;
  public inclusions?: InclusionInfo;

  // Additional Properties
  public specificGravity?: number;
  public refractiveIndex?: string;
  public pleochroism?: string;
  public luster?: string;
  public hardness?: number; // Mohs scale

  // Inventory Properties
  public quantity: number = 1;
  public lotNumber?: string;
  public parcelId?: string;

  // Market Properties
  public marketTrend?: string;
  public comparableValue?: Money;
  public rarityScore?: number; // 1-10 scale

  getSpecificationType(): string {
    return `${this.gemstoneType} - ${this.variety}`;
  }

  validateBusinessRules(): boolean {
    // Gemstone-specific business rules
    if (this.caratWeight.value <= 0) return false;
    if (this.dimensions.volume() <= 0) return false;
    if (this.quantity <= 0) return false;
    
    // Validate certification requirements for high-value stones
    if (this.retailPrice && this.retailPrice.amount > 1000 && !this.certification) {
      return false; // High-value stones should have certification
    }
    
    return true;
  }

  calculateBasePrice(): Money {
    if (!this.cost) {
      throw new Error('Cost is required to calculate base price');
    }
    
    // Base pricing logic for gemstones
    let markup = this.markupPercentage || 100; // Default 100% markup
    
    // Adjust markup based on rarity
    if (this.rarityScore) {
      if (this.rarityScore >= 8) markup *= 1.5; // Rare stones
      else if (this.rarityScore >= 6) markup *= 1.2; // Uncommon stones
    }
    
    // Adjust markup based on certification
    if (this.certification) {
      markup *= 1.1; // 10% premium for certified stones
    }
    
    return this.cost.multiply(1 + markup / 100);
  }

  // Gemstone-specific methods
  updateGrading(grading: GemstoneGrading): void {
    this.grading = grading;
    this.updatedAt = new Date();
    this.version++;
  }

  addCertification(certification: Certification): void {
    this.certification = certification;
    this.updatedAt = new Date();
    this.version++;
  }

  updateTreatment(treatment: TreatmentInfo): void {
    this.treatment = treatment;
    this.updatedAt = new Date();
    this.version++;
  }

  updateInclusions(inclusions: InclusionInfo): void {
    this.inclusions = inclusions;
    this.updatedAt = new Date();
    this.version++;
  }

  updateQuantity(newQuantity: number): void {
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this.quantity = newQuantity;
    this.updatedAt = new Date();
    this.version++;
  }

  isNaturalOrigin(): boolean {
    return this.creationMethod === CreationMethod.NATURAL;
  }

  isLabGrown(): boolean {
    return this.creationMethod === CreationMethod.LAB_GROWN;
  }

  isCertified(): boolean {
    return this.certification !== undefined;
  }

  isPreciousStone(): boolean {
    return [
      GemstoneType.DIAMOND,
      GemstoneType.RUBY,
      GemstoneType.SAPPHIRE,
      GemstoneType.EMERALD
    ].includes(this.gemstoneType);
  }

  calculatePricePerCarat(): Money | undefined {
    if (!this.retailPrice) return undefined;
    
    const caratValue = this.caratWeight.unit === 'carats' 
      ? this.caratWeight.value 
      : this.caratWeight.toCarats().value;
      
    return new Money(
      this.retailPrice.amount / caratValue,
      this.retailPrice.currency
    );
  }

  getQualityScore(): number {
    let score = 0;
    
    // Weight contribution (up to 25 points)
    if (this.caratWeight.value >= 5) score += 25;
    else if (this.caratWeight.value >= 2) score += 20;
    else if (this.caratWeight.value >= 1) score += 15;
    else score += 10;
    
    // Clarity contribution (up to 25 points)
    if (this.grading?.clarityGrade) {
      const clarityPoints = {
        [ClarityGrade.FL]: 25,
        [ClarityGrade.IF]: 23,
        [ClarityGrade.VVS1]: 20,
        [ClarityGrade.VVS2]: 18,
        [ClarityGrade.VS1]: 15,
        [ClarityGrade.VS2]: 12,
        [ClarityGrade.SI1]: 8,
        [ClarityGrade.SI2]: 5,
        [ClarityGrade.I1]: 3,
        [ClarityGrade.I2]: 1,
        [ClarityGrade.I3]: 0
      };
      score += clarityPoints[this.grading.clarityGrade];
    }
    
    // Cut contribution (up to 25 points)
    if (this.grading?.cutGrade) {
      const cutPoints = {
        [CutGrade.EXCELLENT]: 25,
        [CutGrade.VERY_GOOD]: 20,
        [CutGrade.GOOD]: 15,
        [CutGrade.FAIR]: 10,
        [CutGrade.POOR]: 5
      };
      score += cutPoints[this.grading.cutGrade];
    }
    
    // Origin and rarity (up to 25 points)
    if (this.isPreciousStone()) score += 15;
    if (this.isNaturalOrigin()) score += 10;
    if (this.rarityScore && this.rarityScore >= 7) score += 10;
    
    return Math.min(score, 100); // Cap at 100
  }
}
