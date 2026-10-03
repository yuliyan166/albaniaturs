import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.resend.dev', 
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(to: string, offerTitle: string, totalCzk: number) {
  const mailOptions = {
    from: `"AlbaniaTours" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Потвърждение на резервация: ${offerTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background-color: #f9fafb;">
        <h1 style="color: #1e40af;">Потвърждение на резервацията</h1>
        <p>Здравейте!</p>
        <p>Резервацията ви за <strong>${offerTitle}</strong> е успешна.</p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">
            <span style="font-size: 1.2em; color: #047857; font-weight: bold;">Сума за плащане: ${totalCzk} CZK</span>
        </div>
        <p>Благодарим Ви, че избрахте AlbaniaTours! Очакваме ви.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}