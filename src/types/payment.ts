// Payment Types and Interfaces
export type PaymentMethod = 'stripe' | 'paypal' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'deposit' | 'full' | 'partial';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  type: PaymentType;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  paypalTransactionId?: string;
  bankTransferDetails?: {
    transactionRef: string;
    bankName: string;
    accountNumber: string;
    amount: number;
  };
  invoiceUrl?: string;
  receiptUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  customerEmail: string;
  customerName: string;
  partnerId: string;
  partnerName: string;
}

export interface CommissionConfig {
  category: string;
  percentage: number;
  maxAmount?: number;
  minAmount?: number;
}

export interface CommissionTransaction {
  id: string;
  bookingId: string;
  amount: number;
  commissionAmount: number;
  partnerAmount: number;
  currency: string;
  status: 'calculated' | 'paid' | 'pending';
  createdAt: string;
  paidAt?: string;
}
