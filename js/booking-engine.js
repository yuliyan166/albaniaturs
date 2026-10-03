/**
 * AlbaniaTours - Booking & Pricing Engine
 * Handles price calculations and availability validations for 4 service categories
 */

export class BookingEngine {
    /**
     * Universal Price Calculator
     * @param {Object} property - The property object from database
     * @param {Object} params - User selected options (dates, guests, etc.)
     * @returns {Object} { total: number, breakdown: string }
     */
    static calculatePrice(property, params) {
        const rate = parseFloat(property.price_czk);
        let total = 0;
        let breakdown = "";

        switch (property.category) {
            case 'accommodation':
                // Formula: Nights * Nightly Rate
                const nights = this.calculateNights(params.checkIn, params.checkOut);
                total = nights * rate;
                breakdown = `${nights} нощувки x ${rate} CZK`;
                break;

            case 'car_rental':
                // Formula: Rounded 24h blocks * Daily Rate
                const blocks = this.calculate24hBlocks(params.pickup, params.return);
                total = blocks * rate;
                breakdown = `${blocks} дни (24ч блокове) x ${rate} CZK`;
                break;

            case 'tours':
                // Formula: Participants * Price per person
                const participants = parseInt(params.participants) || 1;
                total = participants * rate;
                breakdown = `${participants} участници x ${rate} CZK`;
                break;

            case 'transfers':
                // Formula: Fixed price for the route/vehicle
                total = rate;
                breakdown = `Фиксирана цена за трансфер`;
                break;

            default:
                throw new Error("Unknown property category");
        }

        return {
            total: Math.round(total),
            breakdown: breakdown
        };
    }

    /**
     * Validates if the tour has enough capacity for the requested date
     * @param {Object} property - The tour property
     * @param {string} date - Requested tour date
     * @param {number} participants - Number of people
     * @param {Array} existingBookings - Array of bookings for that property on that date
     * @returns {boolean} 
     */
    static validateTourCapacity(property, date, participants, existingBookings) {
        if (property.category !== 'tours') return true;
        
        const totalOccupied = existingBookings
            .filter(b => b.date === date)
            .reduce((sum, b) => sum + (b.booking_details.participants || 0), 0);

        return (totalOccupied + participants) <= property.capacity;
    }

    // --- Helper Methods ---

    static calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static calculate24hBlocks(pickup, returnDate) {
        const start = new Date(pickup);
        const end = new Date(returnDate);
        const diffTime = Math.abs(end - start);
        const hours = diffTime / (1000 * 60 * 60);
        // Round up to nearest 24h block
        return Math.ceil(hours / 24);
    }
}