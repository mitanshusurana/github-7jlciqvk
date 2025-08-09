// ===================================================================
// Jewelry Domain - Specialized Jewelry Entity
// ===================================================================

import { Product, ProductType, ProductId, SKU } from '../../product-catalog/entities/Product';
import { Money, Weight, Dimensions } from '../../shared/types';

export enum JewelryCategory {
  RING = 'RING',
  NECKLACE = 'NECKLACE',
  BRACELET = 'BRACELET',
  EARRINGS = 'EARRINGS',
  PENDANT = 'PENDANT',
  BROOCH = 'BROOCH',
  ANKLET = 'ANKLET',
  CUFFLINKS = 'CUFFLINKS',
  TIARA = 'TIARA',
  WATCH = 'WATCH',
  CHAIN = 'CHAIN',
  CHARM = 'CHARM',
  SET = 'SET',
  OTHER = 'OTHER'
}

export enum JewelryStyle {
  SOLITAIRE = 'SOLITAIRE',
  HALO = 'HALO',
  VINTAGE = 'VINTAGE',
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  CONTEMPORARY = 'CONTEMPORARY',
  ANTIQUE = 'ANTIQUE',
  ART_DECO = 'ART_DECO',
  VICTORIAN = 'VICTORIAN',
  EDWARDIAN = 'EDWARDIAN',
  THREE_STONE = 'THREE_STONE',
  ETERNITY = 'ETERNITY',
  COCKTAIL = 'COCKTAIL',
  STATEMENT = 'STATEMENT',
  MINIMALIST = 'MINIMALIST'
}

export enum Metal {
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  PLATINUM = 'PLATINUM',
  PALLADIUM = 'PALLADIUM',
  TITANIUM = 'TITANIUM',
  TUNGSTEN = 'TUNGSTEN',
  STAINLESS_STEEL = 'STAINLESS_STEEL',
  BRASS = 'BRASS',
  COPPER = 'COPPER',
  MIXED = 'MIXED'
}

export enum MetalColor {
  YELLOW = 'YELLOW',
  WHITE = 'WHITE',
  ROSE = 'ROSE',
  TWO_TONE = 'TWO_TONE',
  THREE_TONE = 'THREE_TONE',
  NATURAL = 'NATURAL',
  RHODIUM_PLATED = 'RHODIUM_PLATED'
}

export enum Purity {
  // Gold purities
  GOLD_10K = '10K',
  GOLD_14K = '14K',
  GOLD_18K = '18K',
  GOLD_22K = '22K',
  GOLD_24K = '24K',
  
  // Silver purities
  STERLING_SILVER = '925',
  FINE_SILVER = '999',
  
  // Platinum purities
  PLATINUM_900 = 'PT900',
  PLATINUM_950 = 'PT950',
  PLATINUM_999 = 'PT999'
}

export enum SettingType {
  PRONG = 'PRONG',
  BEZEL = 'BEZEL',
  PAVE = 'PAVE',
  CHANNEL = 'CHANNEL',
  INVISIBLE = 'INVISIBLE',
  TENSION = 'TENSION',
  FLUSH = 'FLUSH',
  GYPSY = 'GYPSY',
  CLUSTER = 'CLUSTER',
  HALO = 'HALO',
  MICRO_PAVE = 'MICRO_PAVE',
  BEAD = 'BEAD'
}

export enum ClaspType {
  LOBSTER = 'LOBSTER',
  SPRING_RING = 'SPRING_RING',
  TOGGLE = 'TOGGLE',
  MAGNETIC = 'MAGNETIC',
  BOX = 'BOX',
  FISH_HOOK = 'FISH_HOOK',
  LEVER_BACK = 'LEVER_BACK',
  SCREW_BACK = 'SCREW_BACK',
  PUSH_BACK = 'PUSH_BACK',
  FRICTION_BACK = 'FRICTION_BACK'
}

export enum Warranty {
  NONE = 'NONE',
  SIX_MONTHS = '6_MONTHS',
  ONE_YEAR = '1_YEAR',
  TWO_YEARS = '2_YEARS',
  LIFETIME = 'LIFETIME',
  MANUFACTURER = 'MANUFACTURER'
}

export interface MetalSpecification {
  metal: Metal;
  purity: Purity;
  color: MetalColor;
  weight: Weight;
  percentage?: number; // For mixed metal pieces
  plating?: string;
  hallmarks: string[];
}

export interface GemstoneInSetting {
  id: string;
  gemstoneType: string;
  shape: string;
  caratWeight: Weight;
  settingType: SettingType;
  position: string; // Center, Side, Accent, etc.
  colorGrade?: string;
  clarityGrade?: string;
  cutGrade?: string;
  certification?: string;
  isMainStone: boolean;
}

export interface SizingInfo {
  ringSize?: number;
  length?: number; // For necklaces, bracelets
  width?: number;
  height?: number;
  innerDiameter?: number; // For bangles
  adjustable: boolean;
  sizeRange?: string;
  claspType?: ClaspType;
}

export interface CraftsmanshipInfo {
  artisan?: string;
  craftingTechnique: string[];
  timeToCreate?: number; // in hours
  complexityLevel: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'MASTERPIECE';
  handmade: boolean;
  customMade: boolean;
  limitedEdition?: boolean;
  editionNumber?: number;
  totalEditionSize?: number;
}

export class Jewelry extends Product {
  constructor(
    id: ProductId,
    sku: SKU,
    name: string,
    description: string,
    // Jewelry-specific properties
    public readonly category: JewelryCategory,
    public readonly style: JewelryStyle,
    public readonly metalSpecs: MetalSpecification[],
    public readonly gemstones: GemstoneInSetting[]
  ) {
    super(id, sku, ProductType.JEWELRY, name, description);
  }

  // Core Jewelry Properties
  public dimensions?: Dimensions;
  public totalWeight?: Weight;
  public sizingInfo?: SizingInfo;
  public craftsmanship?: CraftsmanshipInfo;
  public warranty?: Warranty;

  // Business Properties
  public laborCost?: Money;
  public materialCost?: Money;
  public designCost?: Money;
  public retailSuggestedPrice?: Money;

  // Technical Properties
  public wearability: 'DAILY' | 'OCCASIONAL' | 'SPECIAL_OCCASION' = 'DAILY';
  public careInstructions: string[] = [];
  public hypoallergenic: boolean = false;

  getSpecificationType(): string {
    return `${this.category} - ${this.style}`;
  }

  validateBusinessRules(): boolean {
    // Jewelry-specific business rules
    if (this.metalSpecs.length === 0) return false;
    if (this.category === JewelryCategory.RING && !this.sizingInfo?.ringSize && !this.sizingInfo?.adjustable) {
      return false; // Rings should have size information
    }
    
    // Validate gemstone settings
    const mainStones = this.gemstones.filter(g => g.isMainStone);
    if (this.style === JewelryStyle.SOLITAIRE && mainStones.length !== 1) {
      return false; // Solitaire should have exactly one main stone
    }
    
    return true;
  }

  calculateBasePrice(): Money {
    if (!this.materialCost && !this.laborCost) {
      throw new Error('Material cost or labor cost is required to calculate base price');
    }
    
    let totalCost = new Money(0);
    
    if (this.materialCost) totalCost = totalCost.add(this.materialCost);
    if (this.laborCost) totalCost = totalCost.add(this.laborCost);
    if (this.designCost) totalCost = totalCost.add(this.designCost);
    
    // Apply markup based on complexity and craftsmanship
    let markup = this.markupPercentage || 150; // Default 150% markup for jewelry
    
    if (this.craftsmanship?.complexityLevel === 'MASTERPIECE') markup *= 2;
    else if (this.craftsmanship?.complexityLevel === 'COMPLEX') markup *= 1.5;
    else if (this.craftsmanship?.handmade) markup *= 1.3;
    
    if (this.craftsmanship?.limitedEdition) markup *= 1.2;
    
    return totalCost.multiply(1 + markup / 100);
  }

  // Jewelry-specific methods
  addGemstone(gemstone: GemstoneInSetting): void {
    this.gemstones.push(gemstone);
    this.updatedAt = new Date();
    this.version++;
  }

  removeGemstone(gemstoneId: string): void {
    const index = this.gemstones.findIndex(g => g.id === gemstoneId);
    if (index > -1) {
      this.gemstones.splice(index, 1);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  updateGemstone(gemstoneId: string, updates: Partial<GemstoneInSetting>): void {
    const gemstone = this.gemstones.find(g => g.id === gemstoneId);
    if (gemstone) {
      Object.assign(gemstone, updates);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  updateSizing(sizingInfo: SizingInfo): void {
    this.sizingInfo = sizingInfo;
    this.updatedAt = new Date();
    this.version++;
  }

  updateCraftsmanship(craftsmanship: CraftsmanshipInfo): void {
    this.craftsmanship = craftsmanship;
    this.updatedAt = new Date();
    this.version++;
  }

  addMetalSpec(metalSpec: MetalSpecification): void {
    this.metalSpecs.push(metalSpec);
    this.updatedAt = new Date();
    this.version++;
  }

  updateWarranty(warranty: Warranty): void {
    this.warranty = warranty;
    this.updatedAt = new Date();
    this.version++;
  }

  addCareInstruction(instruction: string): void {
    if (!this.careInstructions.includes(instruction)) {
      this.careInstructions.push(instruction);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // Helper methods
  getMainStones(): GemstoneInSetting[] {
    return this.gemstones.filter(g => g.isMainStone);
  }

  getAccentStones(): GemstoneInSetting[] {
    return this.gemstones.filter(g => !g.isMainStone);
  }

  getTotalCaratWeight(): Weight {
    const totalCarats = this.gemstones.reduce((total, gem) => {
      const carats = gem.caratWeight.unit === 'carats' 
        ? gem.caratWeight.value 
        : gem.caratWeight.toCarats().value;
      return total + carats;
    }, 0);
    
    return new Weight(totalCarats, 'carats');
  }

  getPrimaryMetal(): Metal {
    if (this.metalSpecs.length === 0) throw new Error('No metal specifications');
    
    // Return the metal with highest percentage or first one
    const primarySpec = this.metalSpecs.reduce((prev, current) => {
      const prevPercentage = prev.percentage || 100;
      const currentPercentage = current.percentage || 100;
      return currentPercentage > prevPercentage ? current : prev;
    });
    
    return primarySpec.metal;
  }

  getTotalMetalWeight(): Weight {
    const totalGrams = this.metalSpecs.reduce((total, spec) => {
      return total + (spec.weight.unit === 'grams' 
        ? spec.weight.value 
        : spec.weight.toGrams().value);
    }, 0);
    
    return new Weight(totalGrams, 'grams');
  }

  isHypoallergenic(): boolean {
    // Check if all metals are hypoallergenic
    const hypoallergenicMetals = [Metal.PLATINUM, Metal.TITANIUM, Metal.TUNGSTEN];
    return this.metalSpecs.every(spec => 
      hypoallergenicMetals.includes(spec.metal) || 
      (spec.metal === Metal.GOLD && ['18K', '22K', '24K'].includes(spec.purity))
    );
  }

  isAdjustable(): boolean {
    return this.sizingInfo?.adjustable || false;
  }

  getSizeDescription(): string {
    if (!this.sizingInfo) return 'Size not specified';
    
    if (this.category === JewelryCategory.RING) {
      return this.sizingInfo.adjustable 
        ? `Adjustable (${this.sizingInfo.sizeRange || 'various sizes'})` 
        : `Size ${this.sizingInfo.ringSize || 'not specified'}`;
    }
    
    if (this.sizingInfo.length) {
      return `${this.sizingInfo.length}" length`;
    }
    
    return 'Standard size';
  }

  getComplexityScore(): number {
    let score = 0;
    
    // Base complexity by category
    const categoryComplexity = {
      [JewelryCategory.RING]: 5,
      [JewelryCategory.NECKLACE]: 7,
      [JewelryCategory.BRACELET]: 6,
      [JewelryCategory.EARRINGS]: 4,
      [JewelryCategory.PENDANT]: 5,
      [JewelryCategory.BROOCH]: 8,
      [JewelryCategory.SET]: 10
    };
    
    score += categoryComplexity[this.category] || 5;
    
    // Add complexity for gemstones
    score += this.gemstones.length * 2;
    
    // Add complexity for multiple metals
    if (this.metalSpecs.length > 1) score += 3;
    
    // Add complexity for special techniques
    if (this.craftsmanship?.handmade) score += 5;
    if (this.craftsmanship?.customMade) score += 3;
    
    return Math.min(score, 20); // Cap at 20
  }
}
