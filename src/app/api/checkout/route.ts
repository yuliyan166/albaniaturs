import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { bookingId, amount, customerEmail }
      = await req.json();

    const session = await stripe.checkout.sessions.create({
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
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[Checkout Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}