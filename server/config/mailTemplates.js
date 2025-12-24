import dotenv from 'dotenv';
dotenv.config();
export const sendOtpEmail = (email, otp) => {
  return {
    from: `"Mid Night Cafe" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your OTP Verification Code',
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  };
};
