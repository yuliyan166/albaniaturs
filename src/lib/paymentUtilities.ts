import { generateInvoice } from '@/lib/invoice';

/**
 * Generate booking invoice from payment data
 */
export async function generateBookingInvoice({
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
}): Promise<any> {
  const invoice = generateInvoice({
    bookingId,
    amount,
    amountDue,
    paymentMethod,
    transactionRef,
    customerEmail,
  });
  
  return invoice;
}
