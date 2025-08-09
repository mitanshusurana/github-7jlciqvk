// ===================================================================
// Carved Art Domain - Specialized Carved Gemstone Idol Entity
// ===================================================================

import { Product, ProductType, ProductId, SKU } from '../../product-catalog/entities/Product';
import { Money, Weight, Dimensions } from '../../shared/types';

export enum CarvingMaterial {
  JADE = 'JADE',
  QUARTZ = 'QUARTZ',
  AMETHYST = 'AMETHYST',
  ROSE_QUARTZ = 'ROSE_QUARTZ',
  CITRINE = 'CITRINE',
  AGATE = 'AGATE',
  ONYX = 'ONYX',
  MARBLE = 'MARBLE',
  GRANITE = 'GRANITE',
  SOAPSTONE = 'SOAPSTONE',
  OBSIDIAN = 'OBSIDIAN',
  TURQUOISE = 'TURQUOISE',
  MALACHITE = 'MALACHITE',
  LAPIS_LAZULI = 'LAPIS_LAZULI',
  TIGER_EYE = 'TIGER_EYE',
  CARNELIAN = 'CARNELIAN',
  JASPER = 'JASPER',
  FLUORITE = 'FLUORITE',
  SERPENTINE = 'SERPENTINE',
  OTHER = 'OTHER'
}

export enum CarvingStyle {
  TRADITIONAL = 'TRADITIONAL',
  MODERN = 'MODERN',
  CONTEMPORARY = 'CONTEMPORARY',
  ABSTRACT = 'ABSTRACT',
  REALISTIC = 'REALISTIC',
  STYLIZED = 'STYLIZED',
  MINIMALIST = 'MINIMALIST',
  ORNATE = 'ORNATE',
  FOLK_ART = 'FOLK_ART',
  CLASSICAL = 'CLASSICAL'
}

export enum CulturalOrigin {
  CHINESE = 'CHINESE',
  INDIAN = 'INDIAN',
  TIBETAN = 'TIBETAN',
  JAPANESE = 'JAPANESE',
  THAI = 'THAI',
  BURMESE = 'BURMESE',
  NEPALESE = 'NEPALESE',
  INDONESIAN = 'INDONESIAN',
  AFRICAN = 'AFRICAN',
  MAYAN = 'MAYAN',
  AZTEC = 'AZTEC',
  NATIVE_AMERICAN = 'NATIVE_AMERICAN',
  WESTERN = 'WESTERN',
  CONTEMPORARY = 'CONTEMPORARY',
  OTHER = 'OTHER'
}

export enum FinishType {
  POLISHED = 'POLISHED',
  MATTE = 'MATTE',
  BRUSHED = 'BRUSHED',
  TEXTURED = 'TEXTURED',
  NATURAL = 'NATURAL',
  ANTIQUED = 'ANTIQUED',
  GLAZED = 'GLAZED',
  WAXED = 'WAXED'
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  VERY_RARE = 'VERY_RARE',
  UNIQUE = 'UNIQUE',
  ONE_OF_A_KIND = 'ONE_OF_A_KIND'
}

export enum WorkmanshipGrade {
  APPRENTICE = 'APPRENTICE',
  SKILLED = 'SKILLED',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER'
}

export enum DetailLevel {
  SIMPLE = 'SIMPLE',
  MODERATE = 'MODERATE',
  DETAILED = 'DETAILED',
  HIGHLY_DETAILED = 'HIGHLY_DETAILED',
  INTRICATE = 'INTRICATE'
}

export enum AgePeriod {
  CONTEMPORARY = 'CONTEMPORARY', // 1980-present
  MODERN = 'MODERN', // 1960-1980
  MID_CENTURY = 'MID_CENTURY', // 1940-1960
  EARLY_MODERN = 'EARLY_MODERN', // 1900-1940
  COLONIAL = 'COLONIAL', // 1800-1900
  QING_DYNASTY = 'QING_DYNASTY', // 1644-1912
  MING_DYNASTY = 'MING_DYNASTY', // 1368-1644
  ANCIENT = 'ANCIENT', // Before 1368
  UNKNOWN = 'UNKNOWN'
}

export interface DeityInfo {
  name: string;
  culture: CulturalOrigin;
  significance: string;
  attributes: string[];
  symbolism: string;
  blessings?: string[];
}

export interface ArtisanInfo {
  name?: string;
  origin?: string;
  knownPeriod?: string;
  signature?: string;
  specialization?: string[];
  biography?: string;
  otherWorks?: string[];
}

export interface CarvingTechnique {
  primaryTechnique: string;
  tools: string[];
  timeToComplete?: number; // in hours
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER';
  specialMethods?: string[];
}

export interface DimensionalInfo {
  overallDimensions: Dimensions;
  baseIncluded: boolean;
  baseDimensions?: Dimensions;
  baseMaterial?: string;
  standIncluded: boolean;
  standType?: string;
  displayRecommendations?: string;
}

export interface CulturalSignificance {
  religiousSignificance?: string;
  historicalContext?: string;
  symbolicMeaning?: string;
  traditionalUse?: string;
  modernRelevance?: string;
  culturalNotes?: string;
}

export interface AuthenticityInfo {
  authenticated: boolean;
  authenticator?: string;
  authenticationDate?: Date;
  authenticationCertificate?: string;
  provenanceDocumentation?: string[];
  ageVerification?: string;
  materialVerification?: string;
}

export class CarvedArt extends Product {
  constructor(
    id: ProductId,
    sku: SKU,
    name: string,
    description: string,
    // Carved art-specific properties
    public readonly material: CarvingMaterial,
    public readonly carvingStyle: CarvingStyle,
    public readonly culturalOrigin: CulturalOrigin,
    public readonly weight: Weight,
    public readonly dimensions: DimensionalInfo
  ) {
    super(id, sku, ProductType.CARVED_IDOL, name, description);
  }

  // Core Properties
  public deity?: DeityInfo;
  public artisan?: ArtisanInfo;
  public carvingTechnique?: CarvingTechnique;
  public finishType?: FinishType;
  public detailLevel?: DetailLevel;
  public workmanshipGrade?: WorkmanshipGrade;
  public agePeriod?: AgePeriod;
  public rarity?: Rarity;

  // Cultural and Historical
  public culturalSignificance?: CulturalSignificance;
  public authenticity?: AuthenticityInfo;

  // Physical Characteristics
  public colorDescription?: string;
  public mineralComposition?: string;
  public hardness?: number; // Mohs scale
  public clarity?: string;
  public inclusions?: string;
  public naturalFlaws?: string[];

  // Market Information
  public estimatedAge?: number; // in years
  public comparableValue?: Money;
  public marketDemand?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  public collectorInterest?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

  getSpecificationType(): string {
    return `${this.material} Carving - ${this.carvingStyle}`;
  }

  validateBusinessRules(): boolean {
    // Carved art-specific business rules
    if (this.weight.value <= 0) return false;
    if (this.dimensions.overallDimensions.volume() <= 0) return false;
    
    // High-value pieces should have authentication
    if (this.retailPrice && this.retailPrice.amount > 5000 && !this.authenticity?.authenticated) {
      return false;
    }
    
    // Ancient pieces should have provenance
    if (this.agePeriod === AgePeriod.ANCIENT && !this.authenticity?.provenanceDocumentation) {
      return false;
    }
    
    return true;
  }

  calculateBasePrice(): Money {
    if (!this.cost) {
      throw new Error('Cost is required to calculate base price');
    }
    
    let markup = this.markupPercentage || 200; // Default 200% markup for art pieces
    
    // Adjust markup based on rarity
    if (this.rarity) {
      const rarityMultiplier = {
        [Rarity.COMMON]: 1,
        [Rarity.UNCOMMON]: 1.2,
        [Rarity.RARE]: 1.5,
        [Rarity.VERY_RARE]: 2,
        [Rarity.UNIQUE]: 3,
        [Rarity.ONE_OF_A_KIND]: 5
      };
      markup *= rarityMultiplier[this.rarity];
    }
    
    // Adjust markup based on workmanship
    if (this.workmanshipGrade) {
      const workmanshipMultiplier = {
        [WorkmanshipGrade.APPRENTICE]: 1,
        [WorkmanshipGrade.SKILLED]: 1.3,
        [WorkmanshipGrade.MASTER]: 1.8,
        [WorkmanshipGrade.GRANDMASTER]: 2.5
      };
      markup *= workmanshipMultiplier[this.workmanshipGrade];
    }
    
    // Adjust markup based on age
    if (this.agePeriod) {
      const ageMultiplier = {
        [AgePeriod.CONTEMPORARY]: 1,
        [AgePeriod.MODERN]: 1.1,
        [AgePeriod.MID_CENTURY]: 1.2,
        [AgePeriod.EARLY_MODERN]: 1.4,
        [AgePeriod.COLONIAL]: 1.6,
        [AgePeriod.QING_DYNASTY]: 2,
        [AgePeriod.MING_DYNASTY]: 3,
        [AgePeriod.ANCIENT]: 5,
        [AgePeriod.UNKNOWN]: 1
      };
      markup *= ageMultiplier[this.agePeriod];
    }
    
    // Authentication premium
    if (this.authenticity?.authenticated) {
      markup *= 1.2;
    }
    
    return this.cost.multiply(1 + markup / 100);
  }

  // Carved art-specific methods
  updateDeity(deity: DeityInfo): void {
    this.deity = deity;
    this.updatedAt = new Date();
    this.version++;
  }

  updateArtisan(artisan: ArtisanInfo): void {
    this.artisan = artisan;
    this.updatedAt = new Date();
    this.version++;
  }

  updateCarvingTechnique(technique: CarvingTechnique): void {
    this.carvingTechnique = technique;
    this.updatedAt = new Date();
    this.version++;
  }

  updateAuthenticity(authenticity: AuthenticityInfo): void {
    this.authenticity = authenticity;
    this.updatedAt = new Date();
    this.version++;
  }

  updateCulturalSignificance(significance: CulturalSignificance): void {
    this.culturalSignificance = significance;
    this.updatedAt = new Date();
    this.version++;
  }

  updateRarity(rarity: Rarity): void {
    this.rarity = rarity;
    this.updatedAt = new Date();
    this.version++;
  }

  updateWorkmanshipGrade(grade: WorkmanshipGrade): void {
    this.workmanshipGrade = grade;
    this.updatedAt = new Date();
    this.version++;
  }

  // Helper methods
  isAuthenticated(): boolean {
    return this.authenticity?.authenticated || false;
  }

  isAntique(): boolean {
    return this.agePeriod && [
      AgePeriod.ANCIENT,
      AgePeriod.MING_DYNASTY,
      AgePeriod.QING_DYNASTY,
      AgePeriod.COLONIAL
    ].includes(this.agePeriod);
  }

  isReligiousArt(): boolean {
    return this.deity !== undefined || 
           this.culturalSignificance?.religiousSignificance !== undefined;
  }

  hasProvenance(): boolean {
    return this.authenticity?.provenanceDocumentation !== undefined &&
           this.authenticity.provenanceDocumentation.length > 0;
  }

  getArtisticValue(): number {
    let value = 0;
    
    // Base value from workmanship (0-40 points)
    if (this.workmanshipGrade) {
      const workmanshipPoints = {
        [WorkmanshipGrade.APPRENTICE]: 10,
        [WorkmanshipGrade.SKILLED]: 20,
        [WorkmanshipGrade.MASTER]: 30,
        [WorkmanshipGrade.GRANDMASTER]: 40
      };
      value += workmanshipPoints[this.workmanshipGrade];
    }
    
    // Detail level (0-20 points)
    if (this.detailLevel) {
      const detailPoints = {
        [DetailLevel.SIMPLE]: 4,
        [DetailLevel.MODERATE]: 8,
        [DetailLevel.DETAILED]: 12,
        [DetailLevel.HIGHLY_DETAILED]: 16,
        [DetailLevel.INTRICATE]: 20
      };
      value += detailPoints[this.detailLevel];
    }
    
    // Rarity (0-20 points)
    if (this.rarity) {
      const rarityPoints = {
        [Rarity.COMMON]: 2,
        [Rarity.UNCOMMON]: 6,
        [Rarity.RARE]: 10,
        [Rarity.VERY_RARE]: 15,
        [Rarity.UNIQUE]: 18,
        [Rarity.ONE_OF_A_KIND]: 20
      };
      value += rarityPoints[this.rarity];
    }
    
    // Historical value (0-20 points)
    if (this.agePeriod) {
      const agePoints = {
        [AgePeriod.CONTEMPORARY]: 2,
        [AgePeriod.MODERN]: 4,
        [AgePeriod.MID_CENTURY]: 6,
        [AgePeriod.EARLY_MODERN]: 8,
        [AgePeriod.COLONIAL]: 12,
        [AgePeriod.QING_DYNASTY]: 16,
        [AgePeriod.MING_DYNASTY]: 18,
        [AgePeriod.ANCIENT]: 20,
        [AgePeriod.UNKNOWN]: 0
      };
      value += agePoints[this.agePeriod];
    }
    
    return Math.min(value, 100); // Cap at 100
  }

  getCulturalValue(): number {
    let value = 0;
    
    // Religious significance
    if (this.culturalSignificance?.religiousSignificance) value += 25;
    
    // Historical context
    if (this.culturalSignificance?.historicalContext) value += 25;
    
    // Traditional use
    if (this.culturalSignificance?.traditionalUse) value += 20;
    
    // Cultural authenticity
    if (this.isAuthenticated()) value += 20;
    
    // Provenance
    if (this.hasProvenance()) value += 10;
    
    return Math.min(value, 100); // Cap at 100
  }

  getDisplayRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.dimensions.baseIncluded) {
      recommendations.push('Display on included base');
    } else {
      recommendations.push('Recommend suitable display stand');
    }
    
    if (this.finishType === FinishType.POLISHED) {
      recommendations.push('Avoid direct sunlight to prevent color fading');
    }
    
    if (this.material === CarvingMaterial.JADE) {
      recommendations.push('Handle with clean hands to maintain luster');
    }
    
    if (this.isAntique()) {
      recommendations.push('Climate-controlled environment recommended');
      recommendations.push('Minimal handling for preservation');
    }
    
    if (this.isReligiousArt()) {
      recommendations.push('Consider cultural sensitivity in display context');
    }
    
    return recommendations;
  }
}
