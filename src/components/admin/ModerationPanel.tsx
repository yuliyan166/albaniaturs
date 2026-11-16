import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Listing {
  id: string;
  title: { en: string; sq: string };
  category: string;
  priceCZK: number;
  status: 'pending' | 'active' | 'rejected';
}

/**
 * ModerationPanel allows the admin to review all pending listings and approve or reject them.
 */
export const ModerationPanel: React.FC = () => {
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'pending');
    setPendingListings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: 'active' | 'rejected') => {
    const supabase = createClient();
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) alert('Error updating status');
    else fetchPending(); // Refresh list
  };

  if (loading) return <div className="p-4">Loading pending listings...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Listing Moderation</h2>
      
      {pendingListings.length === 0 ? (
        <div className="p-8 text-center bg-green-50 text-green-700 rounded-xl border border-green-200">
          No pending listings to review at this time!
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingListings.map(listing => (
            <div key={listing.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{listing.title.en}</div>
                <div className="text-sm text-gray-500">{listing.category} | {listing.priceCZK} CZK</div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => updateStatus(listing.id, 'rejected')} 
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 font-medium transition"
                >
                  Reject
                </button>
                <button 
                  onClick={() => updateStatus(listing.id, 'active')} 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
