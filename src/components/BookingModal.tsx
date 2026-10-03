'use client';
import { X } from 'lucide-react';
import { useState } from 'react';

interface BookingModalProps {
  offer: any;
  onClose: () => void;
}

export default function BookingModal({ offer, onClose }: BookingModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate Stripe integration
    setTimeout(() => {
      alert('Přesměrování na Stripe platbu...');
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2">Rezervace: {offer.category}</h2>
        <p className="text-gray-600 mb-6">Objekt ID: #{offer.id} | Lokalita: Albánie</p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Datum</label>
            <input type="date" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Počet osob / počet dní</label>
            <input type="number" min="1" defaultValue="1" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500">Celková cena:</span>
          <span className="text-2xl font-bold text-blue-600">1 200 CZK</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Zpracovávám...' : 'Zaplatit nyní'}
        </button>
      </div>
    </div>
  );
}