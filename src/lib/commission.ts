// Automated Commission System for Albania-Turs\nimport { createClient } from '@/lib/supabase/server';

export async function getCategoryCommissionRates(): Promise<CommissionRates> {
  const supabase = await createClient();
  const { data: rates, error } = await supabase
    .from('category_commissions')
    .select('category_id, default_commission');

  if (error) {
    console.error('Error fetching commission rates:', error);
    return DEFAULT_COMMISSION_RATES;
  }

  const result: CommissionRates = { ...DEFAULT_COMMISSION_RATES };

  rates?.forEach((rate) => {
    const key = rate.category_id as keyof CommissionRates;
    if (key && typeof result[key] === 'number') {
      result[key] = rate.default_commission;
    }
  });

  return result;
}

export type CategoryType = 'accommodation' | 'car_rental' | 'tours' | 'transfers';

export interface CommissionRates {
  accommodation: number; // 10% default
  car_rental: number; // 12% default
  tours: number; // 15% default
  transfers: number; // 8% default
  platform_fee_fixed?: number; // Fixed fee per booking
}

export interface CommissionCalculation {
  commissionAmount: number;
  partnerAmount: number;
  platformFee: number;
  rate: number;
  breakdown: CommissionBreakdown;
}

export interface CommissionBreakdown {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  platformFee: number;
  partnerPayout: number;
  taxes?: {
    vat: number;
    incomeTax?: number;
  };
}

// Default commission rates by category
export const DEFAULT_COMMISSION_RATES: CommissionRates = {
  accommodation: 10.0,
  car_rental: 12.0,
  tours: 15.0,
  transfers: 8.0,
  platform_fee_fixed: 0,
};

/**
 * Calculate commission for a booking
 */
export async function calculateCommission({
  categoryId,
  amount,
  partnerId,
  bookingId,
}: {
  categoryId: CategoryType;
  amount: number;
  partnerId?: string;
  bookingId: string;
}): Promise<CommissionCalculation> {
  const supabase = createClient();

  // Get commission rate for category
  const { data: categoryRate } = await supabase
    .from('category_commissions')
    .select('default_commission')
    .eq('category_id', categoryId)
    .single();

  // Get partner-specific commission rate
  let partnerCommissionRate: number | null = null;
  if (partnerId) {
    const { data: partnerData } = await supabase
      .from('profiles')
      .select('partner_commission')
      .eq('id', partnerId)
      .single();
    partnerCommissionRate = partnerData?.partner_commission || null;
  }

  // Use partner commission if available, otherwise use category default
  const commissionRate = partnerCommissionRate || categoryRate?.default_commission || DEFAULT_COMMISSION_RATES[categoryId];

  // Calculate amounts
  const commissionAmount = (amount * commissionRate) / 100;
  const platformFee = amount - commissionAmount;
  const partnerAmount = platformFee;

  // Build breakdown
  const breakdown: CommissionBreakdown = {
    baseAmount: amount,
    commissionRate,
    commissionAmount,
    platformFee,
    partnerPayout: partnerAmount,
  };

  // Calculate taxes (placeholder for tax calculation)
  const vat = calculateTax(amount, 'vat');
  const incomeTax = partnerId ? calculateTax(partnerAmount, 'income_tax') : 0;

  if (vat > 0 || incomeTax > 0) {
    breakdown.taxes = {
      vat,
      incomeTax,
    };
  }

  return {
    commissionAmount,
    partnerAmount,
    platformFee,
    rate: commissionRate,
    breakdown,
  };
}

/**
 * Calculate tax amount based on tax type
 */
function calculateTax(amount: number, taxType: 'vat' | 'income_tax'): number {
  switch (taxType) {
    case 'vat':
      // Default VAT rate (Albania: 20%, Albania tourism services: 0%)
      return 0; // Tourism services are typically VAT exempt in Albania
    case 'income_tax':
      // Placeholder for partner income tax calculation
      return 0; // Would need partner tax status
    default:
      return 0;
  }
}

/**
 * Get commission rates for all categories
 */
export async function getCategoryCommissionRates(): Promise<CommissionRates> {
  const supabase = createClient();
  const { data: rates, error } = await supabase
    .from('category_commissions')
    .select('category_id, default_commission');

  if (error) {
    console.error('Error fetching commission rates:', error);
    return DEFAULT_COMMISSION_RATES;
  }

  const result: CommissionRates = { ...DEFAULT_COMMISSION_RATES };

  rates?.forEach((rate) => {
    const key = rate.category_id as keyof CommissionRates;
    if (key && typeof result[key] === 'number') {
      result[key] = rate.default_commission;
    }
  });

  return result;
}

/**
 * Update commission rate for a category (admin function)
 */
export async function updateCommissionRate({
  categoryId,
  rate,
}: {
  categoryId: CategoryType;
  rate: number;
}): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('category_commissions')
    .update({ default_commission: rate })
    .eq('category_id', categoryId);

  return !error;
}

/**
 * Get partner-specific commission rates
 */
export async function getPartnerCommission(partnerId: string): Promise<number | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('partner_commission')
    .eq('id', partnerId)
    .single();

  if (error) {
    console.error('Error fetching partner commission:', error);
    return null;
  }

  return data?.partner_commission || null;
}

/**
 * Apply automatic commission calculation on booking creation
 */
export async function onBookingCreated({
  bookingId,
  propertyId,
  amount,
  customerId,
}: {
  bookingId: string;
  propertyId: string;
  amount: number;
  customerId: string;
}): Promise<void> {
  const supabase = createClient();

  // Get property category
  const { data: property } = await supabase
    .from('properties')
    .select('category, host_id')
    .eq('id', propertyId)
    .single();

  if (!property) {
    console.error('Property not found:', propertyId);
    return;
  }

  // Calculate commission
  const commission = await calculateCommission({
    categoryId: property.category as CategoryType,
    amount,
    partnerId: property.host_id,
    bookingId,
  });

  // Update booking with commission info
  const { error } = await supabase
    .from('bookings')
    .update({
      applied_commission_percent: commission.rate,
      platform_fee_czk: commission.platformFee,
      partner_amount_czk: commission.partnerAmount,
    })
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking commission:', error);
  }

  // Log commission calculation
  await supabase
    .from('audit_trails')
    .insert({
      user_id: customerId,
      action: 'commission_calculated',
      details: JSON.stringify({
        bookingId,
        propertyId,
        amount,
        commissionRate: commission.rate,
        commissionAmount: commission.commissionAmount,
        partnerAmount: commission.partnerAmount,
      }),
      created_at: new Date().toISOString(),
    });
}
