// ===================================================================
// Customer Domain - Client Relationships and Orders
// ===================================================================

import { AggregateRoot, Money, ContactInfo, Address } from '../../shared/types';
import { ProductId } from '../../product-catalog/entities/Product';

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
  DEALER = 'DEALER',
  COLLECTOR = 'COLLECTOR',
  RETAILER = 'RETAILER',
  WHOLESALER = 'WHOLESALER',
  DESIGNER = 'DESIGNER'
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VIP = 'VIP',
  PREFERRED = 'PREFERRED',
  BLACKLISTED = 'BLACKLISTED',
  PROSPECT = 'PROSPECT'
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  RETURNED = 'RETURNED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  FINANCING = 'FINANCING',
  LAYAWAY = 'LAYAWAY',
  TRADE_IN = 'TRADE_IN'
}

export interface CustomerPreferences {
  communicationMethod: 'EMAIL' | 'PHONE' | 'SMS' | 'MAIL';
  marketingOptIn: boolean;
  newsletterOptIn: boolean;
  preferredLanguage: string;
  timeZone: string;
  currency: string;
  specialInstructions?: string;
}

export interface CreditInfo {
  creditLimit?: Money;
  availableCredit?: Money;
  creditRating?: string;
  paymentTerms?: string; // e.g., "NET_30"
  creditApprovalDate?: Date;
  creditExpiryDate?: Date;
}

export interface PurchaseHistory {
  totalOrders: number;
  totalSpent: Money;
  averageOrderValue: Money;
  firstPurchaseDate?: Date;
  lastPurchaseDate?: Date;
  favoriteCategories: string[];
  preferredPaymentMethod?: PaymentMethod;
  returnRate: number;
  loyaltyPoints?: number;
}

export interface OrderItem {
  id: string;
  productId: ProductId;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  discountAmount?: Money;
  notes?: string;
  customization?: Record<string, any>;
}

export interface ShippingInfo {
  method: string;
  cost: Money;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingAddress: Address;
  specialInstructions?: string;
  signatureRequired: boolean;
  insured: boolean;
  insuranceValue?: Money;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: Money;
  transactionId?: string;
  authorizationCode?: string;
  last4Digits?: string; // For card payments
  paymentDate?: Date;
  dueDate?: Date;
  notes?: string;
}

export interface DiscountInfo {
  code?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number; // Percentage or amount
  description: string;
  appliedAmount: Money;
}

export class Customer implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public contactInfo: ContactInfo,
    public customerType: CustomerType = CustomerType.INDIVIDUAL,
    public status: CustomerStatus = CustomerStatus.PROSPECT,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Personal/Business Information
  public businessName?: string;
  public taxId?: string;
  public dateOfBirth?: Date;
  public addresses: Address[] = [];
  public alternateContacts: ContactInfo[] = [];

  // Customer Management
  public preferences?: CustomerPreferences;
  public creditInfo?: CreditInfo;
  public purchaseHistory?: PurchaseHistory;
  public notes: string[] = [];
  public tags: string[] = [];

  // Relationship Management
  public referredBy?: string;
  public assignedSalesperson?: string;
  public customerSince?: Date;
  public lastContactDate?: Date;
  public nextFollowUpDate?: Date;

  // Business methods
  updateContactInfo(contactInfo: ContactInfo): void {
    this.contactInfo = contactInfo;
    this.updatedAt = new Date();
    this.version++;
  }

  addAddress(address: Address): void {
    this.addresses.push(address);
    this.updatedAt = new Date();
    this.version++;
  }

  updateStatus(status: CustomerStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    this.version++;
  }

  updatePreferences(preferences: CustomerPreferences): void {
    this.preferences = preferences;
    this.updatedAt = new Date();
    this.version++;
  }

  updateCreditInfo(creditInfo: CreditInfo): void {
    this.creditInfo = creditInfo;
    this.updatedAt = new Date();
    this.version++;
  }

  addNote(note: string, userId?: string): void {
    const timestampedNote = `[${new Date().toISOString()}] ${userId ? `(${userId}) ` : ''}${note}`;
    this.notes.push(timestampedNote);
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

  assignSalesperson(salespersonId: string): void {
    this.assignedSalesperson = salespersonId;
    this.updatedAt = new Date();
    this.version++;
  }

  scheduleFollowUp(date: Date): void {
    this.nextFollowUpDate = date;
    this.updatedAt = new Date();
    this.version++;
  }

  recordContact(): void {
    this.lastContactDate = new Date();
    this.updatedAt = new Date();
    this.version++;
  }

  // Helper methods
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getDisplayName(): string {
    return this.businessName || this.getFullName();
  }

  isVIP(): boolean {
    return this.status === CustomerStatus.VIP;
  }

  isPreferred(): boolean {
    return [CustomerStatus.VIP, CustomerStatus.PREFERRED].includes(this.status);
  }

  hasGoodCredit(): boolean {
    return this.creditInfo?.creditRating !== 'POOR' && 
           this.status !== CustomerStatus.BLACKLISTED;
  }

  getAvailableCredit(): Money {
    if (!this.creditInfo?.creditLimit) return new Money(0);
    
    const available = this.creditInfo.availableCredit || this.creditInfo.creditLimit;
    return available;
  }

  canPurchase(amount: Money): boolean {
    if (!this.hasGoodCredit()) return false;
    
    const availableCredit = this.getAvailableCredit();
    return availableCredit.amount >= amount.amount;
  }

  getPrimaryAddress(): Address | undefined {
    return this.addresses[0]; // First address is primary
  }

  getCustomerLifetimeValue(): Money {
    return this.purchaseHistory?.totalSpent || new Money(0);
  }

  getDaysSinceLastPurchase(): number {
    if (!this.purchaseHistory?.lastPurchaseDate) return Infinity;
    
    const now = new Date();
    const lastPurchase = this.purchaseHistory.lastPurchaseDate;
    const diffTime = Math.abs(now.getTime() - lastPurchase.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export class Order implements AggregateRoot {
  public domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    public readonly customerId: string,
    public status: OrderStatus = OrderStatus.DRAFT,
    public version: number = 1,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Order Details
  public items: OrderItem[] = [];
  public subtotal: Money = new Money(0);
  public taxAmount: Money = new Money(0);
  public shippingAmount: Money = new Money(0);
  public discountAmount: Money = new Money(0);
  public totalAmount: Money = new Money(0);

  // Order Information
  public orderDate: Date = new Date();
  public expectedDeliveryDate?: Date;
  public billingAddress?: Address;
  public shippingInfo?: ShippingInfo;
  public paymentInfo?: PaymentInfo;
  public discounts: DiscountInfo[] = [];

  // Internal Information
  public notes: string[] = [];
  public internalNotes: string[] = [];
  public salesPersonId?: string;
  public source?: string; // Website, Store, Phone, etc.
  public priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL';

  // Business methods
  addItem(item: OrderItem): void {
    // Check if item already exists
    const existingItem = this.items.find(i => i.productId.toString() === item.productId.toString());
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.totalPrice = existingItem.unitPrice.multiply(existingItem.quantity);
    } else {
      this.items.push(item);
    }
    
    this.calculateTotals();
    this.updatedAt = new Date();
    this.version++;
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter(i => i.id !== itemId);
    this.calculateTotals();
    this.updatedAt = new Date();
    this.version++;
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      item.totalPrice = item.unitPrice.multiply(quantity);
      this.calculateTotals();
      this.updatedAt = new Date();
      this.version++;
    }
  }

  applyDiscount(discount: DiscountInfo): void {
    this.discounts.push(discount);
    this.calculateTotals();
    this.updatedAt = new Date();
    this.version++;
  }

  removeDiscount(discountCode: string): void {
    this.discounts = this.discounts.filter(d => d.code !== discountCode);
    this.calculateTotals();
    this.updatedAt = new Date();
    this.version++;
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    this.version++;
  }

  updateShippingInfo(shippingInfo: ShippingInfo): void {
    this.shippingInfo = shippingInfo;
    this.shippingAmount = shippingInfo.cost;
    this.calculateTotals();
    this.updatedAt = new Date();
    this.version++;
  }

  updatePaymentInfo(paymentInfo: PaymentInfo): void {
    this.paymentInfo = paymentInfo;
    this.updatedAt = new Date();
    this.version++;
  }

  addNote(note: string): void {
    this.notes.push(`[${new Date().toISOString()}] ${note}`);
    this.updatedAt = new Date();
    this.version++;
  }

  addInternalNote(note: string, userId?: string): void {
    const timestampedNote = `[${new Date().toISOString()}] ${userId ? `(${userId}) ` : ''}${note}`;
    this.internalNotes.push(timestampedNote);
    this.updatedAt = new Date();
    this.version++;
  }

  private calculateTotals(): void {
    // Calculate subtotal
    this.subtotal = this.items.reduce(
      (total, item) => total.add(item.totalPrice),
      new Money(0)
    );

    // Calculate total discount amount
    this.discountAmount = this.discounts.reduce(
      (total, discount) => total.add(discount.appliedAmount),
      new Money(0)
    );

    // Calculate total
    this.totalAmount = this.subtotal
      .add(this.taxAmount)
      .add(this.shippingAmount)
      .add(this.discountAmount.multiply(-1)); // Subtract discount
  }

  // Helper methods
  getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  hasItems(): boolean {
    return this.items.length > 0;
  }

  isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  canModify(): boolean {
    return [OrderStatus.DRAFT, OrderStatus.PENDING].includes(this.status);
  }

  canCancel(): boolean {
    return ![
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED
    ].includes(this.status);
  }

  isPaid(): boolean {
    return this.paymentInfo?.status === PaymentStatus.PAID;
  }

  isShipped(): boolean {
    return [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.COMPLETED].includes(this.status);
  }

  getDaysInStatus(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.updatedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getProcessingTime(): number {
    if (!this.isCompleted()) return 0;
    
    const diffTime = Math.abs(this.updatedAt.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  requiresShipping(): boolean {
    return this.shippingInfo !== undefined;
  }

  getOrderValue(): Money {
    return this.totalAmount;
  }
}
