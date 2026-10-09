import { NextResponse } from 'next/server';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { createClient } from '@/lib/supabase/server';

// Create Stripe instance for Checkout
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  
  let event;
  
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }
    event = stripe.webhooks.constructEvent(
      await req.text(),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  const supabase = await createClient();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as stripe.checkout.Session;
      
      // Get booking ID from metadata
      const bookingId = session.metadata?.bookingId;
      
      if (bookingId) {
        // Update booking status
        await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
          })
          .eq('id', bookingId);
        
        // Update payment record
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            transaction_reference: session.id,
            processed_at: new Date().toISOString(),
          })
          .eq('booking_id', bookingId);
        
        // Send payment confirmation email to customer
        const { data: booking } = await supabase
          .from('bookings')
          .select('customer_id, property_id, total_price_czk, booking_details')
          .eq('id', bookingId)
          .single();
        
        if (booking) {
          // Send email to customer
          console.log(`Payment received for booking ${bookingId}`);
          // Would send email here
          
          // Calculate and log commission
          console.log(`Commission calculation for booking ${bookingId}`);
          // Would call commission calculation here
        }
      }
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as stripe.payment_intent.PaymentIntent;
      
      // Handle payment intent success
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }
    
    case 'charge.failed': {
      const charge = event.data.object as stripe.charge.Charge;
      
      // Handle failed payment
      console.error('Payment failed:', charge.id);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return NextResponse.json({ received: true });
}
