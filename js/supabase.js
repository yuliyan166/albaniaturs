import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://qtaumyzgcblcqqgmprot.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YXVteXpnY2JsY3FxZ21wcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTIwNTYsImV4cCI6MjEwMzk2ODA1Nn0.of2Fd_h9yRdXUIvj-UlOCtsz0fmeFeLs1uqrF3kZ0PE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signUpUser(email, password, role = 'customer', fullName = '') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, full_name: fullName } }
  });
  if (error) throw error;
  return data;
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function fetchActiveListings() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active');
  if (error) throw error;
  return data;
}

export async function createListing(listingData) {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...listingData, status: 'pending' }]);
  if (error) throw error;
  return data;
}