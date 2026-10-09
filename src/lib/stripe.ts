// Stripe Integration for Albania-Turs
import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

export default getStripe;

export async function createPaymentIntent(amount: number, currency: string) {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Payment intent creation failed');
    }
    
    return data;
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string, cardElement: any) {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Stripe not loaded');
  }

  const { error, paymentIntent } = await stripe.confirmCardPayment(
    paymentIntentId,
    { payment_method: cardElement }
  );

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
}

export async function createPaymentMethod(cardElement: any, billingDetails: any) {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Stripe not loaded');
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentMethod;
}
