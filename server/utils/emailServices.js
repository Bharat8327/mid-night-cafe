import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(toEmail, otp, expiresInMint = 5) {
  if (!process.env.SMTP_USER) {
    console.log(
      `[DEV] Sending OTP to ${toEmail}: otp=${otp}  expiresIn=${expiresInMint}s`,
    );
    return;
  }
  console.log(transporter);

  const mail = {
    from: `"MidnytCafe" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Your password reset code',
    text: `Your password reset code is ${otp}. It expires in ${expiresInMint} minute(s).`,
    html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in ${expiresInMint} minute(s).</p>`,
  };
  const info = await transporter.sendMail(mail);
  console.log('Sent OTP email', info.messageId);
}
