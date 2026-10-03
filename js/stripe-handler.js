/**
 * AlbaniaTours - Stripe Payment Integration
 * Handles CZK transactions and triggers booking snapshots
 */

export class StripeHandler {
    constructor(apiKey) {
        this.stripe = Stripe(apiKey);
        this.currency = 'czk';
    }

    /**
     * Processes a payment and, upon success, freezes the financial data in DB
     * @param {Object} bookingData - Data including total price, property, and partner
     * @param {Object} paymentMethodId - The ID from Stripe Elements
     * @param {Object} supabaseClient - Initialized Supabase client
     */
    async processBookingPayment(bookingData, paymentMethodId, supabaseClient) {
        try {
            // 1. Create PaymentIntent on the server (via Supabase Edge Function or similar)
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                body: JSON.stringify({ 
                    amount: Math.round(bookingData.totalPrice * 100), // Stripe expects cents
                    currency: this.currency 
                }),
            });
            const { clientSecret } = await response.json();

            // 2. Confirm Payment with Stripe
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodId,
            });

            if (result.error) throw new Error(result.error.message);

            if (result.paymentIntent.status === 'succeeded') {
                // 3. IMMUTABILITY LOGIC: Snapshot the financial data immediately
                await this.finalizeBooking(bookingData, supabaseClient);
                return { success: true };
            }

        } catch (error) {
            console.error("Payment Error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Saves the finalized booking with frozen commission values
     */
    async finalizeBooking(bookingData, supabaseClient) {
        const { data, error } = await supabaseClient
            .from('bookings')
            .insert([{
                property_id: bookingData.propertyId,
                customer_id: bookingData.customerId,
                total_price_czk: bookingData.totalPrice,
                booking_details: bookingData.details,
                payment_status: 'paid',
                
                // Snapshot values - these will NEVER change for this booking
                applied_commission_percent: bookingData.finalRate,
                platform_fee_czk: bookingData.platformFee,
                partner_amount_czk: bookingData.partnerAmount
            }]);

        if (error) throw error;
    }
}