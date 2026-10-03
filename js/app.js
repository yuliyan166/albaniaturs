import { i18n } from './i18n.js';
import { BookingEngine } from './booking-engine.js';
import { CalendarManager } from './calendar.js';
import { StripeHandler } from './stripe-handler.js';

class App {
    constructor() {
        this.currentCategory = 'accommodation';
        this.selectedProperty = null;
        this.properties = []; // Mock data for now, will be fetched from Supabase
        this.init();
    }

    async init() {
        this.renderUI();
        this.setupEventListeners();
        this.loadMockProperties();
        this.renderProperties();
    }

    renderUI() {
        // Update static texts based on i18n
        document.getElementById('hero-title').innerText = i18n.t('common.welcome');
        
        const langSwitcher = document.getElementById('lang-switcher');
        ['cs', 'en', 'sq'].forEach(lang => {
            const btn = document.createElement('button');
            btn.innerText = lang.toUpperCase();
            btn.className = `px-2 py-1 text-sm border rounded ${i18n.getLanguage() === lang ? 'bg-red-600 text-white' : ''}`;
            btn.onclick = () => {
                i18n.setLanguage(lang);
                this.renderUI();
                this.renderProperties();
            };
            langSwitcher.appendChild(btn);
        });
    }

    setupEventListeners() {
        // Category Tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.onclick = (e) => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.cat;
                this.renderProperties();
            };
        });

        // Modal Close
        document.getElementById('close-modal').onclick = () => {
            document.getElementById('booking-modal').classList.add('hidden');
        };

        // Form Submit
        document.getElementById('adaptive-booking-form').onsubmit = async (e) => {
            e.preventDefault();
            alert("Redirecting to Stripe... (Logic handled by StripeHandler)");
        };
    }

    loadMockProperties() {
        // Example data representing DB records
        this.properties = [
            { id: '1', category: 'accommodation', titles: { cs: 'Apartmán v Tiraně' }, price_czk: 1200, is_demo: true, images: ['https://via.placeholder.com/300'] },
            { id: '2', category: 'car_rental', titles: { cs: 'Fiat 500 Hybrid' }, price_czk: 800, is_demo: false, images: ['https://via.placeholder.com/300'] },
            { id: '3', category: 'tours', titles: { cs: 'Kruhový výlet Berat' }, price_czk: 1500, is_demo: true, images: ['https://via.placeholder.com/300'] },
            { id: '4', category: 'transfers', titles: { cs: 'Letiště Tirana -> Centrum' }, price_czk: 600, is_demo: false, images: ['https://via.placeholder.com/300'] },
        ];
    }

    renderProperties() {
        const grid = document.getElementById('properties-grid');
        grid.innerHTML = '';

        const filtered = this.properties.filter(p => p.category === this.currentCategory);

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl shadow-md overflow-hidden relative cursor-pointer hover:shadow-xl transition";
            card.innerHTML = `
                ${p.is_demo ? `<span class="demo-badge">${i18n.t('common.demo_label')}</span>` : ''}
                <img src="${p.images[0]}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="font-bold text-lg">${p.titles[i18n.getLanguage()] || p.titles['cs']}</h4>
                    <p class="text-red-600 font-bold mt-2">${p.price_czk} CZK / ${this.getUnit(p.category)}</p>
                    <button class="w-full mt-4 bg-gray-100 py-2 rounded font-semibold hover:bg-red-50 transition">
                        ${i18n.t('common.book_now')}
                    </button>
                </div>
            `;
            card.onclick = () => this.openBookingModal(p);
            grid.appendChild(card);
        });
    }

    getUnit(cat) {
        const units = { accommodation: 'noc', car_rental: 'den', tours: 'osoba', transfers: 'kurz' };
        return units[cat];
    }

    openBookingModal(property) {
        this.selectedProperty = property;
        document.getElementById('modal-title').innerText = property.titles[i18n.getLanguage()] || property.titles['cs'];
        const fieldsContainer = document.getElementById('dynamic-fields');
        fieldsContainer.innerHTML = '';

        // Adaptive Form Logic
        if (property.category === 'accommodation') {
            fieldsContainer.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm">Check-in</label><input id="checkIn" type="text" class="w-full border p-2 rounded"></div>
                    <div><label class="block text-sm">Check-out</label><input id="checkOut" type="text" class="w-full border p-2 rounded"></div>
                </div>
            `;
            CalendarManager.initFlatpickr('checkIn');
            CalendarManager.initFlatpickr('checkOut');
        } else if (property.category === 'transfers') {
            fieldsContainer.innerHTML = `
                <div><label class="block text-sm">Flight Number</label><input id="flight" type="text" class="w-full border p-2 rounded" placeholder="e.g. OK123">
                <label class="block text-sm mt-2">Pickup Date</label><input id="pickup" type="text" class="w-full border p-2 rounded"></div>
            `;
            CalendarManager.initFlatpickr('pickup');
        } else if (property.category === 'tours') {
            fieldsContainer.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm">Date</label><input id="tourDate" type="text" class="w-full border p-2 rounded"></div>
                    <div><label class="block text-sm">Participants</label><input id="participants" type="number" value="1" min="1" class="w-full border p-2 rounded"></div>
                </div>
            `;
            CalendarManager.initFlatpickr('tourDate');
        }

        document.getElementById('booking-modal').classList.remove('hidden');
        this.updateLivePrice();
    }

    updateLivePrice() {
        // This would be called on every input change in the modal
        const params = this.getModalParams();
        const result = BookingEngine.calculatePrice(this.selectedProperty, params);
        document.getElementById('total-price-display').innerText = `${result.total} CZK`;
        document.getElementById('price-breakdown').innerText = result.breakdown;
    }

    getModalParams() {
        return {
            checkIn: document.getElementById('checkIn')?.value,
            checkOut: document.getElementById('checkOut')?.value,
            participants: document.getElementById('participants')?.value,
            pickup: document.getElementById('pickup')?.value
        };
    }
}

new App();