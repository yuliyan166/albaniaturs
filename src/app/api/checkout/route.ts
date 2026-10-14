import { NextResponse } from 'next/server';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Create Stripe instance for Checkout
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export async function POST(req: Request) {
  try {
    const { bookingId, amount, customerEmail } = await req.json();

    const stripe = (await stripePromise) as Stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // Use cast to access static methods properly
    const session = await ((stripe as any).checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: `Booking #${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?id=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancelled`,
      metadata: {
        bookingId: bookingId,
      },
    })) as any;

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Checkout Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
