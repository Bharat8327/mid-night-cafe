import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import genrateOtp from '../utils/genrateOtp.js';
import { sendOtpEmail } from '../config/mailTemplates.js';
import admin from 'firebase-admin';
import { sendEmail, verifyEmailAddresses } from '../utils/aws.js';
import handleOtpError from '../utils/handleOtpError.js';
// import transporter from '../config/nodemailer.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone || !role) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, Status.BAD_REQUEST, 'User already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: phone,
      role,
    });
    return successResponse(res, Status.CREATED, 'User created successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    const isExist = await User.findOne({ email }).populate('password');

    if (!isExist) {
      errorResponse(res, Status.NOT_FOUND, `this ${email} Not Registerd`);
    }

    const isMatch = await bcrypt.compare(password, isExist.password);

    if (!isMatch) {
      errorResponse(res, Status.UNAUTHORIZED, 'Invalud Password');
    }

    const token = genrateWebToken({
      id: isExist._id,
      email,
      name: isExist.name,
      role: isExist.role,
    });
    res.cookie('myCookie', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return successResponse(res, Status.OK, message[200], {
      authenticated: true,
      role: isExist.role,
      name: isExist.name,
      id: isExist.id,
      token: token,
      email: isExist.email,
      mobile: isExist.mobile,
      address: isExist.address,
    });
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const verifyUser = async (req, res) => {
  try {
    if (!req.user) {
      errorResponse(res, Status.UNAUTHORIZED, message[401]);
    }

    successResponse(res, Status.OK, message[200], {
      authenticated: true,
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    });
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const authWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      errorResponse(res, Status.BAD_GATEWAY, message[400]);
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      const year =
        new Date().getFullYear() + Math.floor(Math.random() * 1000 + 12);
      const password = await bcrypt.hash(`google-auth ${year}`, 12);

      user = new User({
        name: decodedToken.name || 'No name',
        email: decodedToken.email,
        password,
      });
      await user.save();
    }

    const token = genrateWebToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const refreshToken = genrateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000,
    });

    successResponse(res, Status.OK, message[200], {
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: token,
    });
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const authWithgit = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      errorResponse(res, Status.BAD_REQUEST, 'No idToken provided');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const name = decodedToken.name;
    const picture = decodedToken.picture;
    const email = decodedToken.email;

    let user = await User.findOne({ email });
    if (!user) {
      const year =
        new Date().getFullYear() + Math.floor(Math.random() * 1000 + 12);
      const password = await bcrypt.hash(`github-auth ${year}`, 12);

      user = new User({
        name: name || 'No Name',
        email,
        password,
      });
      await user.save();
    }

    const token = genrateWebToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const refreshToken = genrateRefreshToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.cookie('myCookie', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000,
    });

    successResponse(res, Status.OK, message[200], {
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: token,
    });
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !Array.isArray([email])) {
      return errorResponse(res, Status.BAD_REQUEST, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, Status.NOT_FOUND, 'User not found');
    }

    if (!user.awsVerify) {
      const verificationSuccess = await verifyEmailAddresses([email]);
      user.awsVerify = true;
      await user.save();

      return successResponse(
        res,
        Status.OK,
        'Verification email sent successfully',
      );
    }

    return await otpMailService(req, res);
  } catch (error) {
    console.error(error);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, message[500]);
  }
};

export const otpMailService = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(
        res,
        Status.BAD_REQUEST,
        'Enter valid email address',
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, Status.NOT_FOUND, 'User not found');
    }
    if (!user.awsVerify) {
      return errorResponse(
        res,
        Status.BAD_REQUEST,
        'Email not verified with AWS SES',
      );
    }
    const reset = user.passwordReset || {};
    if (reset.blockedUntil && reset.blockedUntil > new Date()) {
      return errorResponse(
        res,
        Status.TOO_MANY_REQUESTS,
        'Too many OTP requests. Try again later.',
      );
    }
    const now = new Date();
    if (!reset.firstSendAt || now - reset.firstSendAt > 10 * 60 * 1000) {
      reset.sendCount = 0;
      reset.firstSendAt = now;
    }
    if (reset.sendCount >= 3) {
      reset.blockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
      await user.save();
      return errorResponse(
        res,
        Status.TOO_MANY_REQUESTS,
        'OTP limit exceeded. Try after 15 minutes.',
      );
    }
    const otp = genrateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    reset.otpHash = otpHash;
    reset.otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    reset.sendCount += 1;
    reset.attempts = 0;
    reset.blockedUntil = null;
    user.passwordReset = reset;
    await user.save();

    const result = await sendEmail([email], otp);
    return successResponse(res, Status.OK, 'OTP sent successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const verifyOtpService = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    await otpVerifiedHelper(email, otp);

    return successResponse(res, Status.OK, 'OTP verified successfully');
  } catch (error) {
    return handleOtpError(res, error);
  }
};

export const passwordUpdate = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
      return errorResponse(res, Status.BAD_REQUEST, message[502]);
    }

    await otpVerifiedHelper(email, otp, newPassword);

    return successResponse(res, Status.OK, 'Password updated successfully');
  } catch (error) {
    return handleOtpError(res, error);
  }
};

const otpVerifiedHelper = async (email, otp, newPassword = null) => {
  const user = await User.findOne({ email });

  if (!user || !user.passwordReset?.otpHash) {
    throw new Error('OTP_NOT_FOUND');
  }

  const reset = user.passwordReset;
  const now = new Date();

  if (reset.blockedUntil && reset.blockedUntil > now) {
    throw new Error('TOO_MANY_ATTEMPTS');
  }

  if (!reset.otpExpiresAt || reset.otpExpiresAt < now) {
    throw new Error('OTP_EXPIRED');
  }

  if (reset.attempts >= 3) {
    reset.blockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
    await user.save();
    throw new Error('TOO_MANY_ATTEMPTS');
  }

  const isValid = await bcrypt.compare(otp, reset.otpHash);

  if (!isValid) {
    reset.attempts += 1;
    await user.save();
    throw new Error('INVALID_OTP');
  }

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordReset = {
      otpHash: null,
      otpExpiresAt: null,
      sendCount: 0,
      attempts: 0,
      blockedUntil: null,
      firstSendAt: null,
    };
    await user.save();
  }
  return true;
};

export const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    errorResponse(res, Status.BAD_REQUEST, 'Refresh token is required');
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);
    const { _id, email } = decoded;
    const accessToken = genrateWebToken({ _id, email });
    errorResponse(res, Status.OK, accessToken);
  } catch (e) {
    errorResponse(res, Status.UNAUTHORIZED, 'Invalid Refresh token');
  }
};

function genrateWebToken(data) {
  try {
    return jwt.sign(data, config.jwt.secret, {
      expiresIn: '1d',
    });
  } catch (error) {
    console.log(error);
  }
}

function genrateRefreshToken(data) {
  try {
    return jwt.sign(data, config.jwt.secret, {
      expiresIn: '1y',
    });
  } catch (error) {
    console.log(error);
  }
}
