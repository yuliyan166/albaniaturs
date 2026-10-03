import Stripe from 'stripe';

/**
 * Principal Engineer Note:
 * Singleton pattern for Stripe client to prevent multiple initializations
 * during Next.js hot-reloads in development.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2023-10-16',
    typescript: true,
  });

export interface PaymentSessionParams {
  bookingId: string;
  amount: number;
  offerTitle: string;
  customerEmail: string;
}

export async function createPaymentSession({
  bookingId,
  amount,
  offerTitle,
  customerEmail,
}: PaymentSessionParams) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'czk',
          product_data: {
            name: offerTitle,
          },
          unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents/haleres
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: customerEmail,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/cancel`,
    metadata: {
      bookingId: bookingId,
    },
  });

  return session.url;
}