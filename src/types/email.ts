// Email Types and Templates
export type EmailType = 
  | 'registration_confirmation' 
  | 'booking_confirmation' 
  | 'booking_cancellation' 
  | 'payment_receipt'
  | 'payment_failed'
  | 'partner_new_booking'
  | 'partner_new_client'
  | 'partner_new_payment';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: string[];
}

export interface EmailTrigger {
  type: EmailType;
  triggerCondition: string;
  recipientType: 'client' | 'partner' | 'admin';
  enabled: boolean;
}

// Email Templates
export const emailTemplates: Record<EmailType, EmailTemplate> = {
  registration_confirmation: {
    subject: 'Welcome to AlbaniaTours - Your Registration Confirmed',
    html: `<h2>Welcome to AlbaniaTours!</h2>
           <p>Thank you for registering with AlbaniaTours. Your account has been created successfully.</p>
           <p>You can now browse our offers, make bookings, and manage your reservations.</p>
           <p>Best regards,<br>The AlbaniaTours Team</p>`,
    text: 'Welcome to AlbaniaTours! Your registration has been confirmed. You can now browse offers and make bookings.',
  },
  
  booking_confirmation: {
    subject: 'Booking Confirmation - AlbaniaTours',
    html: `<h2>Booking Confirmed!</h2>
           <p>Thank you for your booking. Your reservation has been confirmed.</p>
           <h3>Booking Details:</h3>
           <ul>
             <li>Service: {serviceName}</li>
             <li>Date: {date}</li>
             <li>Total: {price} {currency}</li>
           </ul>
           <p>Your booking reference: {bookingReference}</p>
           <p>We look forward to serving you!</p>`,
    text: 'Your booking has been confirmed. Booking details: Service, Date, Total. Booking reference: {bookingReference}',
  },
  
  booking_cancellation: {
    subject: 'Booking Cancellation - AlbaniaTours',
    html: `<h2>Booking Cancelled</h2>
           <p>Your booking has been successfully cancelled.</p>
           <h3>Cancelled Booking:</h3>
           <ul>
             <li>Service: {serviceName}</li>
             <li>Original Date: {date}</li>
             <li>Cancellation Date: {cancellationDate}</li>
           </ul>
           {refundDetails}
           <p>If you have any questions, please contact our support team.</p>`,
    text: 'Your booking has been cancelled. Please review the details above. Refund information: {refundDetails}',
  },
  
  payment_receipt: {
    subject: 'Payment Receipt - AlbaniaTours',
    html: `<h2>Payment Receipt</h2>
           <p>Thank you for your payment.</p>
           <h3>Transaction Details:</h3>
           <ul>
             <li>Transaction ID: {transactionId}</li>
             <li>Amount: {amount} {currency}</li>
             <li>Date: {date}</li>
             <li>Method: {paymentMethod}</li>
           </ul>
           <p>You can download your invoice from your account.</p>`,
    text: 'Payment receipt. Transaction ID: {transactionId}, Amount: {amount}, Date: {date}, Method: {paymentMethod}',
  },
  
  payment_failed: {
    subject: 'Payment Failed - AlbaniaTours',
    html: `<h2>Payment Failed</h2>
           <p>We were unable to process your payment.</p>
           <h3>Transaction Details:</h3>
           <ul>
             <li>Transaction ID: {transactionId}</li>
             <li>Amount: {amount} {currency}</li>
             <li>Try again: {retryLink}</li>
           </ul>
           <p>If the problem persists, please contact our support team.</p>`,
    text: 'Payment failed. Transaction ID: {transactionId}, Amount: {amount}. Please try again or contact support.',
  },
  
  partner_new_booking: {
    subject: 'New Booking - AlbaniaTours',
    html: `<h2>New Booking Received!</h2>
           <p>You have received a new booking for your service.</p>
           <h3>Booking Details:</h3>
           <ul>
             <li>Service: {serviceName}</li>
             <li>Customer: {customerName}</li>
             <li>Date: {date}</li>
             <li>Amount: {amount} {currency}</li>
             <li>Status: {status}</li>
           </ul>
           <p>Log in to your partner dashboard to manage this booking.</p>`,
    text: 'New booking received! Service: {serviceName}, Customer: {customerName}, Amount: {amount} {currency}',
  },
  
  partner_new_client: {
    subject: 'New Registered Client - AlbaniaTours',
    html: `<h2>New Client Registered!</h2>
           <p>A new customer has registered on AlbaniaTours.</p>
           <h3>Client Details:</h3>
           <ul>
             <li>Name: {clientName}</li>
             <li>Email: {clientEmail}</li>
             <li>Registered: {registrationDate}</li>
           </ul>
           <p>This customer may book your services in the future.</p>`,
    text: 'New client registered! Name: {clientName}, Email: {clientEmail}',
  },
  
  partner_new_payment: {
    subject: 'New Payment Received - AlbaniaTours',
    html: `<h2>Payment Received!</h2>
           <p>A new payment has been processed for your service.</p>
           <h3>Payment Details:</h3>
           <ul>
             <li>Amount: {amount} {currency}</li>
             <li>Payment Method: {paymentMethod}</li>
             <li>Processing Fee: {fee} {currency}</li>
             <li>Your Earnings: {earnings} {currency}</li>
             <li>Date: {date}</li>
           </ul>
           <p>Your commission rate: {commissionRate}%</p>`,
    text: 'Payment received! Amount: {amount} {currency}, Earnings: {earnings} {currency}, Rate: {commissionRate}%',
  },
};
