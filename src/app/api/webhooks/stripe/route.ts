import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

/**
 * Critical Endpoint: Listens for Stripe events to confirm payments.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId in metadata' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Update booking status to 'paid'
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'paid', payment_intent_id: session.payment_intent })
      .eq('id', bookingId);

    if (error) {
      console.error('[Stripe Webhook] Supabase update error after checkout.session.completed:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true, eventId: event.id });
}