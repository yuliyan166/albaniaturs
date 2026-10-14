// Commission System for Albania-Turs
import { CommissionConfig, CommissionTransaction } from '@/types/payment';
import { createClient } from '@/lib/supabase/server';

// Default commission rates by category
const DEFAULT_COMMISSION_RATES: Record<string, number> = {
  accommodation: 10,
  cars: 12,
  tours: 15,
  transfers: 8,
};

/**
 * Calculate commission based on category and amount
 */
export function calculateCommission(amount: number, partnerId?: string): {
  commissionAmount: number;
  partnerAmount: number;
  commissionRate: number;
} {
  // Get partner-specific rate if exists
  // For now, use default category rates
  
  // Determine category from partner's business type
  // In production, this would be fetched from partner profile
  
  const categoryRate = DEFAULT_COMMISSION_RATES['accommodation']; // Default to accommodation for demo
  const commissionAmount = amount * (categoryRate / 100);
  
  return {
    commissionAmount,
    partnerAmount: amount - commissionAmount,
    commissionRate: categoryRate,
  };
}

/**
 * Recalculate commission for existing transaction
 */
export async function recalculateCommission(transactionId: string) {
  const supabase = await createClient();
  
  const { data: transaction } = await supabase
    .from('commission_transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const { commissionAmount, partnerAmount } = calculateCommission(
    transaction.amount,
    transaction.partner_id
  );

  const { error } = await supabase
    .from('commission_transactions')
    .update({
      commission_amount: commissionAmount,
      partner_amount: partnerAmount,
      recalculated_at: new Date().toISOString(),
    })
    .eq('id', transactionId);

  if (error) {
    throw error;
  }

  return { success: true, commissionAmount, partnerAmount };
}

/**
 * Payouts processing
 */
export async function processPayouts(partnerId: string, payoutAmount: number) {
  const supabase = await createClient();
  
  // In production, this would integrate with Stripe Connect or PayPal Payouts
  
  const { error } = await supabase
    .from('payouts')
    .insert({
      partner_id: partnerId,
      amount: payoutAmount,
      status: 'pending',
      method: 'bank_transfer', // Default to bank transfer
    });

  if (error) {
    console.error('Payout Error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, payoutId: 'PAYOUT-' + Date.now() };
}

/**
 * Get partner commission summary
 */
export async function getCommissionSummary(partnerId: string, period: 'month' | 'year' = 'month') {
  const supabase = await createClient();
  
  const { data: transactions } = await supabase
    .from('commission_transactions')
    .select('*')
    .eq('partner_id', partnerId)
    .gte('created_at', new Date(new Date().setDate(1)).toISOString()) // Start of current month
    .order('created_at', { ascending: false });

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission_amount, 0);
  const totalPartnerAmount = transactions.reduce((sum, t) => sum + t.partner_amount, 0);

  return {
    period,
    totalAmount,
    totalCommission,
    totalPartnerAmount,
    transactionCount: transactions?.length || 0,
    transactions,
  };
}

/**
 * Audit commission changes
 */
export async function auditCommissionChange(
  partnerId: string,
  categoryId: string,
  oldRate: number,
  newRate: number,
  ChangedByAdminId: string
) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('commission_audit_trail')
    .insert({
      partner_id: partnerId,
      category_id: categoryId,
      old_rate: oldRate,
      new_rate: newRate,
      changed_by: ChangedByAdminId,
      changed_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Commission Audit Error:', error);
  }

  return { success: !error };
}
