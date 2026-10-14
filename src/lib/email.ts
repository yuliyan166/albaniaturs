import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailEventType = 
  | 'registration_confirmation' 
  | 'booking_confirmation' 
  | 'booking_cancellation' 
  | 'payment_received'
  | 'partner_new_booking'
  | 'partner_new_client'
  | 'partner_new_payment';

export interface EmailTemplate {
  subject: string;
  template: string;
  variables: string[];
}

export const EMAIL_TEMPLATES: Record<EmailEventType, EmailTemplate> = {
  registration_confirmation: {
    subject: 'Registro i suksesme në AlbaniaTours! / Registration successful!',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Welcome to AlbaniaTours!</h1>
        
        <p>Dear {{name}},</p>
        
        <p>Thank you for registering with AlbaniaTours! Your account has been created successfully.</p>
        
        <h3>Your Account Details:</h3>
        <ul>
          <li>Name: {{name}}</li>
          <li>Email: {{email}}</li>
          <li>Role: {{role}}</li>
        </ul>
        
        <p>You can now browse our services, make bookings, and manage your travel plans.</p>
        
        <a href="{{dashboardUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
          If you didn't create an account with AlbaniaTours, please ignore this email.
        </p>
      </div>
    `,
    variables: ['name', 'email', 'role', 'dashboardUrl'],
  },
  
  booking_confirmation: {
    subject: 'Booking Confirmation - AlbaniaTours',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Booking Confirmed! ✅</h1>
        
        <p>Dear {{customerName}},</p>
        
        <p>Your booking has been successfully confirmed. Here are the details:</p>
        
        <h3>Booking Details:</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> {{bookingId}}</p>
          <p><strong>Service:</strong> {{serviceName}}</p>
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Time:</strong> {{time}}</p>
          <p><strong>Guests:</strong> {{guests}}</p>
          <p><strong>Total Amount:</strong> {{totalAmount}} {{currency}}</p>
        </div>
        
        <p>A confirmation email has been sent to {{email}}. Please keep this for your records.</p>
        
        <p>Thank you for choosing AlbaniaTours!</p>
        
        <a href="{{bookingUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Booking Details</a>
      </div>
    `,
    variables: ['customerName', 'bookingId', 'serviceName', 'date', 'time', 'guests', 'totalAmount', 'currency', 'email', 'bookingUrl'],
  },
  
  booking_cancellation: {
    subject: 'Booking Cancelled - AlbaniaTours',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Booking Cancelled ❌</h1>
        
        <p>Dear {{customerName}},</p>
        
        <p>We regret to inform you that your booking has been cancelled.</p>
        
        <h3>Cancelled Booking Details:</h3>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> {{bookingId}}</p>
          <p><strong>Service:</strong> {{serviceName}}</p>
          <p><strong>Original Date:</strong> {{originalDate}}</p>
          <p><strong>Refund Amount:</strong> {{refundAmount}} {{currency}}</p>
          <p><strong>Refund Method:</strong> {{refundMethod}}</p>
        </div>
        
        <p>The refund has been processed to your original payment method and should appear in your account within 5-10 business days.</p>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <a href="{{contactUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Contact Support</a>
      </div>
    `,
    variables: ['customerName', 'bookingId', 'serviceName', 'originalDate', 'refundAmount', 'currency', 'refundMethod', 'contactUrl'],
  },
  
  payment_received: {
    subject: 'Payment Received - AlbaniaTours',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Payment Received! 💰</h1>
        
        <p>Dear {{customerName}},</p>
        
        <p>Thank you for your payment. We have received {{amount}} {{currency}} for your booking.</p>
        
        <h3>Payment Details:</h3>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> {{bookingId}}</p>
          <p><strong>Amount Paid:</strong> {{amount}} {{currency}}</p>
          <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
          <p><strong>Transaction ID:</strong> {{transactionId}}</p>
          <p><strong>Date:</strong> {{paymentDate}}</p>
        </div>
        
        <p>Your booking is now confirmed. You will receive a confirmation email shortly.</p>
        
        <p>Thank you for trusting AlbaniaTours!</p>
      </div>
    `,
    variables: ['customerName', 'amount', 'currency', 'bookingId', 'paymentMethod', 'transactionId', 'paymentDate'],
  },
  
  partner_new_booking: {
    subject: 'New Booking - AlbaniaTours Partner Portal',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Booking Notification! 📝</h1>
        
        <p>Dear {{partnerName}},</p>
        
        <p>You have received a new booking for your service!</p>
        
        <h3>Booking Details:</h3>
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> {{bookingId}}</p>
          <p><strong>Customer:</strong> {{customerName}}</p>
          <p><strong>Email:</strong> {{customerEmail}}</p>
          <p><strong>Phone:</strong> {{customerPhone}}</p>
          <p><strong>Service:</strong> {{serviceName}}</p>
          <p><strong>Date:</strong> {{serviceDate}}</p>
          <p><strong>Amount:</strong> {{amount}} {{currency}}</p>
        </div>
        
        <p>Please login to your AlbaniaTours Partner Portal to view and manage this booking.</p>
        
        <a href="{{partnerDashboardUrl}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Partner Portal</a>
      </div>
    `,
    variables: ['partnerName', 'bookingId', 'customerName', 'customerEmail', 'customerPhone', 'serviceName', 'serviceDate', 'amount', 'currency', 'partnerDashboardUrl'],
  },
  
  partner_new_client: {
    subject: 'New Client Registered - AlbaniaTours',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Client Registered! 👤</h1>
        
        <p>Dear {{partnerName}},</p>
        
        <p>A new customer has registered on AlbaniaTours. They may be interested in your services!</p>
        
        <h3>Customer Details:</h3>
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> {{customerName}}</p>
          <p><strong>Email:</strong> {{customerEmail}}</p>
          <p><strong>Phone:</strong> {{customerPhone}}</p>
          <p><strong>Location:</strong> {{customerLocation}}</p>
        </div>
        
        <p>The customer has been added to your client database and can now book your services directly.</p>
      </div>
    `,
    variables: ['partnerName', 'customerName', 'customerEmail', 'customerPhone', 'customerLocation'],
  },
  
  partner_new_payment: {
    subject: 'Payment Received from Client - AlbaniaTours Partner Portal',
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Payment Received from Client! 💵</h1>
        
        <p>Dear {{partnerName}},</p>
        
        <p>Great news! You have received a payment from a client for your service.</p>
        
        <h3>Payment Details:</h3>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> {{bookingId}}</p>
          <p><strong>Customer:</strong> {{customerName}}</p>
          <p><strong>Service:</strong> {{serviceName}}</p>
          <p><strong>Gross Amount:</strong> {{grossAmount}} {{currency}}</p>
          <p><strong>Your Commission ({{commissionRate}}%):</strong> {{commissionAmount}} {{currency}}</p>
          <p><strong>Your Payout:</strong> {{partnerAmount}} {{currency}}</p>
          <p><strong>Payment Status:</strong> {{paymentStatus}}</p>
        </div>
        
        <p>The platform commission has been automatically calculated and deducted. Your payout will be transferred to your bank account (IBAN: {{partnerIban}}) within the next 7-14 business days.</p>
      </div>
    `,
    variables: ['partnerName', 'bookingId', 'customerName', 'serviceName', 'grossAmount', 'currency', 'commissionRate', 'commissionAmount', 'partnerAmount', 'paymentStatus', 'partnerIban'],
  },
};

/**
 * Send email with template variables
 */
export async function sendEmail({
  to,
  eventType,
  variables,
}: {
  to: string;
  eventType: EmailEventType;
  variables: Record<string, string | number>;
}) {
  const template = EMAIL_TEMPLATES[eventType];
  
  // Replace variables in template
  let html = template.template;
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'AlbaniaTours <no-reply@albania-turs.com>',
      to,
      subject: template.subject,
      html,
      text: convertHtmlToText(html),
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error };
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

/**
 * Convert HTML to plain text
 */
function convertHtmlToText(html: string): string {
  return html
    .replace(/<style>[\s\S]*?<\/style>/gi, '')
    .replace(/<script>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Send email to admin when critical events occur
 */
export async function sendAdminNotification({
  eventType,
  details,
}: {
  eventType: string;
  details: Record<string, any>;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@albania-turs.com';
  
  const notification = {
    subject: `Alert: ${eventType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">⚠️ System Alert</h1>
        
        <p><strong>Event:</strong> ${eventType}</p>
        
        <h3>Details:</h3>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <pre>${JSON.stringify(details, null, 2)}</pre>
        </div>
      </div>
    `,
  };
  
  return await resend.emails.send({
    from: 'AlbaniaTours <no-reply@albania-turs.com>',
    to: adminEmail,
    subject: notification.subject,
    html: notification.html,
  });
}
