// ===================================================================
// Inventory Domain - Stock Management
// ===================================================================

import { AggregateRoot, Money, AuditActionType } from '../../shared/types';
import { ProductId } from '../../product-catalog/entities/Product';

export enum MovementType {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  RESERVATION = 'RESERVATION',
  RELEASE = 'RELEASE',
  DAMAGE = 'DAMAGE',
  THEFT = 'THEFT',
  RETURN = 'RETURN',
  SAMPLE = 'SAMPLE'
}

export enum LocationType {
  WAREHOUSE = 'WAREHOUSE',
  SHOWROOM = 'SHOWROOM',
  SAFE = 'SAFE',
  VAULT = 'VAULT',
  DISPLAY = 'DISPLAY',
  SHIPPING = 'SHIPPING',
  REPAIR = 'REPAIR',
  CONSIGNMENT = 'CONSIGNMENT',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  VIRTUAL = 'VIRTUAL' // For dropshipping
}

export enum ABCClassification {
  A = 'A', // High value, low quantity
  B = 'B', // Medium value, medium quantity  
  C = 'C'  // Low value, high quantity
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  RECALLED = 'RECALLED',
  QUARANTINE = 'QUARANTINE'
}

export interface StockLocation {
  id: string;
  name: string;
  type: LocationType;
  address?: string;
  capacity?: number;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM';
  climateControlled: boolean;
  insuranceCoverage?: Money;
  accessRestrictions?: string[];
  contactPerson?: string;
  operatingHours?: string;
}

export interface InventoryMetrics {
  turnoverRate: number;
  daysOnHand: number;
  reorderFrequency: number;
  stockoutFrequency: number;
  carryingCost: Money;
  shrinkageRate: number;
  lastCalculated: Date;
}

export interface ReorderConfiguration {
  enabled: boolean;
  reorderPoint: number;
  economicOrderQuantity: number;
  maximumStock: number;
  leadTimeDays: number;
  safetyStock: number;
  seasonalAdjustment?: number;
  supplier?: string;
  autoReorder: boolean;
}

export interface QualityControl {
  lastInspectionDate?: Date;
  inspectedBy?: string;
  conditionNotes?: string;
  defectsFound?: string[];
  actionsTaken?: string[];
  nextInspectionDue?: Date;
  certificationValid?: boolean;
}

export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly productId: ProductId,
    public readonly movementType: MovementType,
    public readonly quantity: number,
    public readonly fromLocation?: string,
    public readonly toLocation?: string,
    public readonly userId?: string,
    public readonly notes?: string,
    public readonly reference?: string, // Order ID, Transfer ID, etc.
    public readonly timestamp: Date = new Date()
  ) {
    if (quantity <= 0) {
      throw new Error('Movement quantity must be positive');
    }
  }

  public unitCost?: Money;
  public totalValue?: Money;
  public relatedOrderId?: string;
  public batchNumber?: string;
  public expiryDate?: Date;
  public qualityChecked: boolean = false;
  public approved: boolean = false;
  public approvedBy?: string;
  public approvalDate?: Date;

  approve(userId: string): void {
    this.approved = true;
    this.approvedBy = userId;
    this.approvalDate = new Date();
  }

  isInbound(): boolean {
    return [MovementType.INBOUND, MovementType.RETURN].includes(this.movementType);
  }

  isOutbound(): boolean {
    return [MovementType.OUTBOUND, MovementType.DAMAGE, MovementType.THEFT, MovementType.SAMPLE].includes(this.movementType);
  }

  calculateValue(): Money | undefined {
    if (this.unitCost) {
      return this.unitCost.multiply(this.quantity);
    }
    return this.totalValue;
  }
}

export class InventoryItem implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    public readonly productId: ProductId,
    public readonly locationId: string,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Core inventory data
  public quantityOnHand: number = 0;
  public quantityReserved: number = 0;
  public quantityAvailable: number = 0;
  public unitCost?: Money;
  public totalValue?: Money;

  // Stock management
  public status: StockStatus = StockStatus.IN_STOCK;
  public abcClassification?: ABCClassification;
  public reorderConfig?: ReorderConfiguration;
  public qualityControl?: QualityControl;

  // Analytics
  public metrics?: InventoryMetrics;
  public lastCountDate?: Date;
  public lastSoldDate?: Date;
  public firstReceivedDate?: Date;

  // Physical tracking
  public serialNumbers: string[] = [];
  public batchNumbers: string[] = [];
  public binLocation?: string;
  public storageInstructions?: string[];

  // Movement history
  public movements: StockMovement[] = [];

  // Business methods
  updateQuantity(newQuantity: number, movementType: MovementType, userId?: string, notes?: string): void {
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const oldQuantity = this.quantityOnHand;
    const quantityChange = newQuantity - oldQuantity;

    // Create movement record
    const movement = new StockMovement(
      `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      this.productId,
      movementType,
      Math.abs(quantityChange),
      quantityChange < 0 ? this.locationId : undefined,
      quantityChange > 0 ? this.locationId : undefined,
      userId,
      notes
    );

    this.movements.push(movement);
    this.quantityOnHand = newQuantity;
    this.updateAvailableQuantity();
    this.updateStatus();
    this.updatedAt = new Date();
    this.version++;
  }

  reserveQuantity(quantity: number, userId?: string, reference?: string): void {
    if (quantity <= 0) {
      throw new Error('Reserve quantity must be positive');
    }

    if (quantity > this.quantityAvailable) {
      throw new Error('Insufficient available quantity for reservation');
    }

    const movement = new StockMovement(
      `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      this.productId,
      MovementType.RESERVATION,
      quantity,
      undefined,
      this.locationId,
      userId,
      `Reserved: ${reference || 'Unknown'}`,
      reference
    );

    this.movements.push(movement);
    this.quantityReserved += quantity;
    this.updateAvailableQuantity();
    this.updateStatus();
    this.updatedAt = new Date();
    this.version++;
  }

  releaseReservation(quantity: number, userId?: string, reference?: string): void {
    if (quantity <= 0) {
      throw new Error('Release quantity must be positive');
    }

    if (quantity > this.quantityReserved) {
      throw new Error('Cannot release more than reserved quantity');
    }

    const movement = new StockMovement(
      `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      this.productId,
      MovementType.RELEASE,
      quantity,
      this.locationId,
      undefined,
      userId,
      `Released: ${reference || 'Unknown'}`,
      reference
    );

    this.movements.push(movement);
    this.quantityReserved -= quantity;
    this.updateAvailableQuantity();
    this.updateStatus();
    this.updatedAt = new Date();
    this.version++;
  }

  transferTo(targetLocationId: string, quantity: number, userId?: string, notes?: string): StockMovement {
    if (quantity <= 0) {
      throw new Error('Transfer quantity must be positive');
    }

    if (quantity > this.quantityAvailable) {
      throw new Error('Insufficient available quantity for transfer');
    }

    const movement = new StockMovement(
      `xfr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      this.productId,
      MovementType.TRANSFER,
      quantity,
      this.locationId,
      targetLocationId,
      userId,
      notes
    );

    this.movements.push(movement);
    this.quantityOnHand -= quantity;
    this.updateAvailableQuantity();
    this.updateStatus();
    this.updatedAt = new Date();
    this.version++;

    return movement;
  }

  updateUnitCost(cost: Money): void {
    this.unitCost = cost;
    this.calculateTotalValue();
    this.updatedAt = new Date();
    this.version++;
  }

  updateReorderConfig(config: ReorderConfiguration): void {
    this.reorderConfig = config;
    this.updatedAt = new Date();
    this.version++;
  }

  updateQualityControl(qc: QualityControl): void {
    this.qualityControl = qc;
    this.updatedAt = new Date();
    this.version++;
  }

  updateABCClassification(classification: ABCClassification): void {
    this.abcClassification = classification;
    this.updatedAt = new Date();
    this.version++;
  }

  addSerialNumber(serialNumber: string): void {
    if (!this.serialNumbers.includes(serialNumber)) {
      this.serialNumbers.push(serialNumber);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  addBatchNumber(batchNumber: string): void {
    if (!this.batchNumbers.includes(batchNumber)) {
      this.batchNumbers.push(batchNumber);
      this.updatedAt = new Date();
      this.version++;
    }
  }

  // Helper methods
  private updateAvailableQuantity(): void {
    this.quantityAvailable = this.quantityOnHand - this.quantityReserved;
  }

  private updateStatus(): void {
    if (this.quantityOnHand === 0) {
      this.status = StockStatus.OUT_OF_STOCK;
    } else if (this.reorderConfig && this.quantityOnHand <= this.reorderConfig.reorderPoint) {
      this.status = StockStatus.LOW_STOCK;
    } else if (this.quantityReserved > 0 && this.quantityAvailable === 0) {
      this.status = StockStatus.RESERVED;
    } else {
      this.status = StockStatus.IN_STOCK;
    }
  }

  private calculateTotalValue(): void {
    if (this.unitCost) {
      this.totalValue = this.unitCost.multiply(this.quantityOnHand);
    }
  }

  isLowStock(): boolean {
    return this.status === StockStatus.LOW_STOCK;
  }

  isOutOfStock(): boolean {
    return this.status === StockStatus.OUT_OF_STOCK;
  }

  needsReorder(): boolean {
    return this.reorderConfig?.enabled && 
           this.quantityOnHand <= (this.reorderConfig?.reorderPoint || 0);
  }

  canFulfillOrder(requestedQuantity: number): boolean {
    return this.quantityAvailable >= requestedQuantity;
  }

  getRecentMovements(days: number = 30): StockMovement[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.movements.filter(m => m.timestamp >= cutoffDate);
  }

  calculateTurnoverRate(period: number = 365): number {
    if (!this.unitCost || this.quantityOnHand === 0) return 0;
    
    const recentMovements = this.getRecentMovements(period);
    const soldQuantity = recentMovements
      .filter(m => m.isOutbound())
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const averageInventory = this.quantityOnHand; // Simplified calculation
    
    return averageInventory > 0 ? soldQuantity / averageInventory : 0;
  }

  calculateCarryingCost(annualRate: number = 0.15): Money {
    if (!this.totalValue) return new Money(0);
    
    return this.totalValue.multiply(annualRate);
  }

  getDaysOnHand(): number {
    const turnoverRate = this.calculateTurnoverRate();
    return turnoverRate > 0 ? 365 / turnoverRate : Infinity;
  }

  updateMetrics(): void {
    this.metrics = {
      turnoverRate: this.calculateTurnoverRate(),
      daysOnHand: this.getDaysOnHand(),
      reorderFrequency: this.calculateReorderFrequency(),
      stockoutFrequency: this.calculateStockoutFrequency(),
      carryingCost: this.calculateCarryingCost(),
      shrinkageRate: this.calculateShrinkageRate(),
      lastCalculated: new Date()
    };
    
    this.updatedAt = new Date();
    this.version++;
  }

  private calculateReorderFrequency(): number {
    const reorderMovements = this.movements.filter(m => m.movementType === MovementType.INBOUND);
    const daysInPeriod = 365;
    const periodsWithReorders = new Set(reorderMovements.map(m => 
      Math.floor(m.timestamp.getTime() / (1000 * 60 * 60 * 24 * 30)) // Monthly periods
    )).size;
    
    return periodsWithReorders / (daysInPeriod / 30); // Reorders per month
  }

  private calculateStockoutFrequency(): number {
    const stockoutMovements = this.movements.filter(m => 
      m.movementType === MovementType.OUTBOUND && this.quantityOnHand === 0
    );
    
    return stockoutMovements.length / 365; // Stockouts per year
  }

  private calculateShrinkageRate(): number {
    const adjustmentMovements = this.movements.filter(m => 
      [MovementType.DAMAGE, MovementType.THEFT, MovementType.ADJUSTMENT].includes(m.movementType)
    );
    
    const totalShrinkage = adjustmentMovements.reduce((sum, m) => sum + m.quantity, 0);
    const totalReceived = this.movements
      .filter(m => m.isInbound())
      .reduce((sum, m) => sum + m.quantity, 0);
    
    return totalReceived > 0 ? totalShrinkage / totalReceived : 0;
  }
}
