import crypto from 'crypto';

export function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length);
}
export default generateOtp;
