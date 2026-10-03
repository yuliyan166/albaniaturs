import { supabase } from './supabase.js';

let currentCommissionRate = 0.10;

export async function loadPendingProperties() {
  const tbody = document.getElementById('pendingPropertiesBody');
  if (!tbody) return;

  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'pending');

    if (error) throw error;

    if (!properties || properties.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Žádné nemovitosti ke schválení.</td></tr>';
      return;
    }

    tbody.innerHTML = properties.map(p => `
      <tr>
        <td class="px-6 py-4 font-medium text-gray-900">${p.title_cs || p.title_en || 'Bez názvu'}</td>
        <td class="px-6 py-4 text-gray-600">${p.location || 'N/A'}</td>
        <td class="px-6 py-4 text-gray-900 font-semibold">${p.price_per_night_czk || 0} Kč</td>
        <td class="px-6 py-4 text-right space-x-2">
          <button data-id="${p.id}" data-action="active" class="btn-action bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium">Schválit</button>
          <button data-id="${p.id}" data-action="rejected" class="btn-action bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium">Zamítnout</button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const status = e.target.getAttribute('data-action');
        handleStatusChange(id, status);
      });
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Chyba: ${err.message}</td></tr>`;
  }
}

export async function handleStatusChange(propertyId, newStatus) {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ status: newStatus })
      .eq('id', propertyId);

    if (error) throw error;
    alert('Stav nemovitosti byl aktualizován.');
    loadPendingProperties();
  } catch (err) {
    alert('Chyba při změně stavu: ' + err.message);
  }
}

export async function loadBookingsOverview() {
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;

  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;

    if (!bookings || bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Žádné rezervace.</td></tr>';
      return;
    }

    tbody.innerHTML = bookings.map(b => {
      const total = b.total_price_czk || 0;
      const platformFee = total * currentCommissionRate;
      const hostPayout = total - platformFee;

      return `
        <tr>
          <td class="px-6 py-4 font-mono text-xs text-gray-500">${b.id.slice(0, 8)}...</td>
          <td class="px-6 py-4 font-semibold text-gray-900">${total.toLocaleString('cs-CZ')} Kč</td>
          <td class="px-6 py-4 text-green-600 font-medium">${hostPayout.toLocaleString('cs-CZ')} Kč</td>
          <td class="px-6 py-4 text-blue-600 font-medium">${platformFee.toLocaleString('cs-CZ')} Kč</td>
          <td class="px-6 py-4"><span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">${b.status || 'pending'}</span></td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Chyba: ${err.message}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPendingProperties();
  loadBookingsOverview();

  const saveBtn = document.getElementById('saveCommissionBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const val = parseFloat(document.getElementById('commissionInput').value);
      if (!isNaN(val) && val >= 0 && val <= 100) {
        currentCommissionRate = val / 100;
        alert(`Provize została zmieniona na ${val}%.`);
        loadBookingsOverview();
      }
    });
  }
});