import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * CommissionManager implements a 4-tier commission hierarchy.
 */
export const CommissionManager: React.FC = () => {
  const [globalRate, setGlobalRate] = useState(10);
  const [categoryRates, setCategoryRates] = useState({
    accommodation: 10,
    car: 10,
    tour: 15,
    transfer: 8
  });

  const saveSettings = async () => {
    try {
      const supabase = createClient();
      // Store global default
      await supabase.from('site_settings').upsert({ key: 'global_commission', value: globalRate });
      // Store category matrix as JSONB
      await supabase.from('site_settings').upsert({ key: 'category_commissions', value: categoryRates });
      alert('✅ Commission matrix saved!');
    } catch (e) {
      console.error('Save failed:', e);
      alert('❌ Error saving settings');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Commission Matrix</h2>
        <p className="text-gray-600 mb-6">Set the commission percentage that AlbaniaTours takes from each booking.</p>
      </div>

      {/* Level 1: Global Default */}
      <section className="p-4 bg-slate-50 rounded-lg border">
        <h3 className="font-semibold mb-3 text-slate-700">1. Global Default</h3>
        <div className="flex items-center space-x-4">
          <input 
            type="number" 
            value={globalRate} 
            onChange={(e) => setGlobalRate(Number(e.target.value))} 
            className="p-2 border rounded-md w-20"
          />
          <span className="font-bold text-slate-600">% of total amount</span>
        </div>
      </section>

      {/* Level 2: Category Override */}
      <section className="p-4 bg-slate-50 rounded-lg border">
        <h3 className="font-semibold mb-4 text-slate-700">2. Category Override</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categoryRates).map(([cat, rate]) => (
            <div key={cat} className="flex justify-between items-center p-2 bg-white border rounded">
              <span className="capitalize text-sm font-medium">{cat}</span>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setCategoryRates({...categoryRates, [cat]: Number(e.target.value)})}
                  className="p-1 border rounded w-16 text-right"
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info for Levels 3 & 4 */}
      <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
        <strong>ℹ️ Info:</strong> Level 3 (Partner) and Level 4 (Promotional) are set individually in partner profiles or listing settings.
      </div>

      <button 
        onClick={saveSettings} 
        className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition"
      >
        Save Commission Matrix
      </button>
    </div>
  );
};
