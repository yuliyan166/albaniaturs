'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPendingOffers() {
  try {
    // КРИТИЧНА ПРОМЯНА: Добавяме await, защото createClient е async
    const supabase = await createClient(); 
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('[getPendingOffers] Error:', error);
    throw error;
  }
}

export async function updateOfferStatus(id: string, status: string) {
  try {
    const supabase = await createClient(); // Добавен await
    const { error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('[updateOfferStatus] Error:', error);
    throw error;
  }
}

export async function getFinancialStats() {
  try {
    const supabase = await createClient(); // Добавен await
    const { data, error } = await supabase
      .from('bookings')
      .select('total_amount, commission_amount')
      .eq('status', 'paid');

    if (error || !data) throw error || new Error('No data');

    const turnover = data.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
    const revenue = data.reduce((sum, item) => sum + Number(item.commission_amount || 0), 0);

    return {
      turnover,
      revenue,
      payouts: turnover - revenue,
      totalRevenue: turnover,
      totalCommission: revenue,
      partnerPayouts: turnover - revenue
    };
  } catch (error: any) {
    console.error('[getFinancialStats] Error:', error);
    throw error;
  }
}

export async function getAdminFinancials() {
  // Използваме същата логика с await за консистенция
  return await getFinancialStats();
}