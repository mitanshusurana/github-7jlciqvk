// ===================================================================
// Shared Kernel - Common Types and Value Objects
// ===================================================================

export interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventData: any;
  occurredAt: Date;
  version: number;
}

export interface AggregateRoot {
  id: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  domainEvents: DomainEvent[];
}

// Value Objects
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative');
    if (!currency) throw new Error('Currency is required');
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}

export class Dimensions {
  constructor(
    public readonly length: number,
    public readonly width: number,
    public readonly height: number,
    public readonly unit: 'mm' | 'cm' | 'inches' = 'mm'
  ) {
    if (length <= 0 || width <= 0 || height <= 0) {
      throw new Error('Dimensions must be positive');
    }
  }

  volume(): number {
    return this.length * this.width * this.height;
  }

  toString(): string {
    return `${this.length}x${this.width}x${this.height} ${this.unit}`;
  }
}

export class Weight {
  constructor(
    public readonly value: number,
    public readonly unit: 'grams' | 'carats' | 'ounces' = 'grams'
  ) {
    if (value <= 0) throw new Error('Weight must be positive');
  }

  toCarats(): Weight {
    if (this.unit === 'carats') return this;
    if (this.unit === 'grams') return new Weight(this.value * 5, 'carats');
    throw new Error('Conversion not supported');
  }

  toGrams(): Weight {
    if (this.unit === 'grams') return this;
    if (this.unit === 'carats') return new Weight(this.value / 5, 'grams');
    throw new Error('Conversion not supported');
  }

  toString(): string {
    return `${this.value} ${this.unit}`;
  }
}

export class ContactInfo {
  constructor(
    public readonly email: string,
    public readonly phone?: string,
    public readonly website?: string
  ) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly country: string
  ) {
    if (!street || !city || !state || !zipCode || !country) {
      throw new Error('All address fields are required');
    }
  }

  toString(): string {
    return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
  }
}

// Common Enums
export enum AuditActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  MOVED = 'MOVED',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  APPRAISED = 'APPRAISED'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export interface AuditTrail {
  id: string;
  entityId: string;
  entityType: string;
  action: AuditActionType;
  userId: string;
  userName: string;
  timestamp: Date;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  notes?: string;
}
