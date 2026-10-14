import { createClient } from '@/lib/supabase/server';
import { sendEmail, EmailEventType } from '@/lib/email';

/**
 * Trigger email based on event type
 */
export async function triggerEmail({
  eventType,
  userId,
  bookingId,
  variables,
}: {
  eventType: EmailEventType;
  userId?: string;
  bookingId?: string;
  variables?: Record<string, any>;
}) {
  const supabase = createClient();
  
  // Get user email
  let userEmail: string | null = null;
  
  if (userId) {
    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();
    
    userEmail = user?.email || null;
  }
  
  // Get email from booking if not provided
  if (!userEmail && bookingId) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('customer_id')
      .eq('id', bookingId)
      .single();
    
    if (booking?.customer_id) {
      const { data: user } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', booking.customer_id)
        .single();
      
      userEmail = user?.email || null;
    }
  }
  
  if (!userEmail) {
    console.error('No email address found for event:', eventType);
    return { success: false, error: 'Email address not found' };
  }
  
  // Send email
  const result = await sendEmail({
    to: userEmail,
    eventType,
    variables: variables || {},
  });
  
  // Log email in audit trail
  if (userId) {
    await supabase
      .from('audit_trails')
      .insert({
        user_id: userId,
        action: 'email_sent',
        details: JSON.stringify({
          eventType,
          to: userEmail,
          success: result.success,
        }),
        created_at: new Date().toISOString(),
      });
  }
  
  return result;
}

/**
 * Trigger email for registration confirmation
 */
export async function sendRegistrationEmail({
  userId,
  name,
  email,
  role,
}: {
  userId: string;
  name: string;
  email: string;
  role: string;
}) {
  return await triggerEmail({
    eventType: 'registration_confirmation',
    userId,
    variables: {
      name,
      email,
      role,
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    },
  });
}

/**
 * Trigger email for booking confirmation
 */
export async function sendBookingConfirmationEmail({
  userId,
  bookingId,
  serviceName,
  date,
  time,
  guests,
  totalAmount,
  currency = 'CZK',
}: {
  userId: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time?: string;
  guests: number;
  totalAmount: number;
  currency?: string;
}) {
  return await triggerEmail({
    eventType: 'booking_confirmation',
    userId,
    bookingId,
    variables: {
      customerName: 'Customer',
      bookingId,
      serviceName,
      date,
      time: time || 'TBD',
      guests,
      totalAmount,
      currency,
      email: '', // Will be fetched internally
      bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/bookings/${bookingId}`,
    },
  });
}

/**
 * Trigger email for booking cancellation
 */
export async function sendBookingCancellationEmail({
  userId,
  bookingId,
  serviceName,
  originalDate,
  refundAmount,
  currency = 'CZK',
  refundMethod = 'bank_transfer',
}: {
  userId: string;
  bookingId: string;
  serviceName: string;
  originalDate: string;
  refundAmount: number;
  currency?: string;
  refundMethod?: string;
}) {
  return await triggerEmail({
    eventType: 'booking_cancellation',
    userId,
    bookingId,
    variables: {
      customerName: 'Customer',
      bookingId,
      serviceName,
      originalDate,
      refundAmount,
      currency,
      refundMethod,
      contactUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
  });
}

/**
 * Trigger email for payment received
 */
export async function sendPaymentReceivedEmail({
  userId,
  bookingId,
  amount,
  paymentMethod,
  transactionId,
  currency = 'CZK',
}: {
  userId: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  currency?: string;
}) {
  return await triggerEmail({
    eventType: 'payment_received',
    userId,
    bookingId,
    variables: {
      customerName: 'Customer',
      amount,
      currency,
      bookingId,
      paymentMethod,
      transactionId,
      paymentDate: new Date().toLocaleDateString(),
    },
  });
}

/**
 * Trigger email to partner for new booking
 */
export async function sendPartnerNewBookingEmail({
  partnerId,
  bookingId,
  customerName,
  customerEmail,
  customerPhone,
  serviceName,
  serviceDate,
  amount,
  currency = 'CZK',
}: {
  partnerId: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceDate: string;
  amount: number;
  currency?: string;
}) {
  return await triggerEmail({
    eventType: 'partner_new_booking',
    userId: partnerId,
    variables: {
      partnerName: 'Partner',
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      serviceName,
      serviceDate,
      amount,
      currency,
      partnerDashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/partner`,
    },
  });
}

/**
 * Trigger email to partner for payment received
 */
export async function sendPartnerPaymentEmail({
  partnerId,
  bookingId,
  customerName,
  serviceName,
  grossAmount,
  commissionRate,
  partnerAmount,
  currency = 'CZK',
  paymentStatus = 'completed',
}: {
  partnerId: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  grossAmount: number;
  commissionRate: number;
  partnerAmount: number;
  currency?: string;
  paymentStatus?: string;
}) {
  // Get partner IBAN
  const supabase = createClient();
  const { data: partner } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', partnerId)
    .single();
  
  const { data: partnerProfile } = await supabase
    .from('profiles')
    .select('phone')
    .eq('id', partnerId)
    .single();
  
  return await triggerEmail({
    eventType: 'partner_new_payment',
    userId: partnerId,
    variables: {
      partnerName: partner?.full_name || 'Partner',
      bookingId,
      customerName,
      serviceName,
      grossAmount,
      currency,
      commissionRate,
      commissionAmount: (grossAmount * commissionRate) / 100,
      partnerAmount,
      paymentStatus,
      partnerIban: 'AL41 ... (private)', // Would be fetched from secure storage
    },
  });
}
