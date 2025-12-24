import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/* Create transporter */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
console.log(
  process.env.SMTP_USER,
  process.env.SMTP_PASS,
  process.env.SMTP_HOST,
  Number(process.env.SMTP_PORT),
);

export async function sendOtpEmail(toEmail, otp, expiresInMin = 5) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(
      `[DEV MODE] OTP for ${toEmail}: ${otp} (expires in ${expiresInMin} min)`,
    );
    return;
  }

  const mailOptions = {
    from: `"MidnytCafe" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your password reset code',
    text: `Your password reset code is ${otp}. It expires in ${expiresInMin} minute(s).`,
    html: `
      <p>Your password reset code is:</p>
      <h2>${otp}</h2>
      <p>This code expires in ${expiresInMin} minute(s).</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
  } catch (error) {
    console.error('SMTP SEND ERROR:', error.message);
    throw error;
  }
}
