'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export const ListingForm = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_cs: '', title_en: '', title_sq: '',
    description: '', category: 'accommodation', price_czk: 0, image: '/images/placeholder.jpg'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('properties').insert([{
        host_id: user?.id,
        titles: { cs: form.title_cs, en: form.title_en, sq: form.title_sq },
        description: form.description,
        category: form.category,
        price_czk: form.price_czk,
        image: form.image,
        status: 'pending' // Auto-pending for admin approval
      }]);
      if (error) throw error;
      alert('Offer submitted for moderation!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <h3 className="text-xl font-bold mb-4">Add New Offer</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input placeholder="Title (CS)" required className="p-2 border rounded" onChange={e => setForm({...form, title_cs: e.target.value})} />
        <input placeholder="Title (EN)" required className="p-2 border rounded" onChange={e => setForm({...form, title_en: e.target.value})} />
        <input placeholder="Title (SQ)" required className="p-2 border rounded" onChange={e => setForm({...form, title_sq: e.target.value})} />
      </div>
      <textarea placeholder="Description" required className="w-full p-2 border rounded h-32" onChange={e => setForm({...form, description: e.target.value})} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="p-2 border rounded" onChange={e => setForm({...form, category: e.target.value})}>
          <option value="accommodation">Accommodation</option>
          <option value="car">Car Rental</option>
          <option value="tour">Tour</option>
          <option value="transfer">Transfer</option>
        </select>
        <input type="number" placeholder="Price (CZK)" required className="p-2 border rounded" onChange={e => setForm({...form, price_czk: Number(e.target.value)})} />
        <input placeholder="Image path (/images/...)" required className="p-2 border rounded" onChange={e => setForm({...form, image: e.target.value})} />
      </div>
      <button disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
        {loading ? 'Saving...' : 'Submit Offer'}
      </button>
    </form>
  );
};