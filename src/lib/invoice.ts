// Invoice Generation Utility

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TaxItem {
  name: string;
  rate: number;
  amount: number;
}

export interface InvoiceSummary {
  subtotal: number;
  taxes: number;
  total: number;
  paid: number;
  balance: number;
}

export interface Invoice {
  invoiceId: string;
  bookingId: string;
  customerEmail: string;
  amount: number;
  amountDue: number;
  paymentMethod: string;
  transactionRef: string;
  date: string;
  items: InvoiceItem[];
  taxes: TaxItem[];
  summary: InvoiceSummary;
}

export function generateInvoice({
  bookingId,
  amount,
  amountDue,
  paymentMethod,
  transactionRef,
  customerEmail,
}: {
  bookingId: string;
  amount: number;
  amountDue: number;
  paymentMethod: string;
  transactionRef: string;
  customerEmail: string;
}): Invoice {
  return {
    invoiceId: `INV-${bookingId}-${Date.now()}`,
    bookingId,
    customerEmail,
    amount,
    amountDue,
    paymentMethod,
    transactionRef,
    date: new Date().toISOString(),
    items: [
      {
        description: `Booking Service for ${bookingId}`,
        quantity: 1,
        unitPrice: amount,
        totalPrice: amount,
      },
    ],
    taxes: [
      {
        name: 'VAT',
        rate: 21,
        amount: 0, // Services may be VAT exempt
      },
    ],
    summary: {
      subtotal: amount,
      taxes: 0,
      total: amount,
      paid: amount - amountDue,
      balance: amountDue,
    },
  };
}

export interface Receipt {
  receiptId: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  date: string;
  summary: {
    totalAmount: number;
    paymentMethod: string;
    transactionId: string;
    status: string;
  };
}

export function generateReceipt({
  bookingId,
  amount,
  paymentMethod,
  transactionId,
}: {
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
}): Receipt {
  return {
    receiptId: `RCT-${bookingId}-${Date.now()}`,
    bookingId,
    amount,
    paymentMethod,
    transactionId,
    date: new Date().toISOString(),
    summary: {
      totalAmount: amount,
      paymentMethod,
      transactionId,
      status: 'completed',
    },
  };
}
