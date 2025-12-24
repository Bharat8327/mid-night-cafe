import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';
import genrateOtp from '../utils/genrateOtp.js';
import { sendOtpEmail } from '../config/mailTemplates.js';
import transporter from '../config/nodemailer.js';

import admin from 'firebase-admin';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log(req.body);

    // Validate input
    if (!name || !email || !password || !phone || !role) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, Status.BAD_REQUEST, 'User already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 11);

    // Create new user (User.create already saves to DB)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: phone,
      role,
    });

    console.log('User created:', newUser._id);

    // Success response
    return successResponse(res, Status.CREATED, 'User created successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const login = async (req, res) => {
  try {
    // Removed 'rememberMe' as it was declared but never used
    const { email, password, rememberMe } = req.body;
    console.log(req.body);

    if (!email || !password) {
      errorResponse(res, Status.BAD_REQUEST, message[400]);
    }
    console.log('1');

    // Check if user exists
    const isExist = await User.findOne({ email }).populate('password');
    console.log(isExist);

    if (!isExist) {
      errorResponse(res, Status.NOT_FOUND, `this ${email} Not Registerd`);
    }

    // Compare password
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
    console.log(isExist);

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
    console.log('details dummy', req.user);

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
      // If idToken is not provided, return error
      errorResponse(res, Status.BAD_GATEWAY, message[400]);
    }

    // Verify the Google idToken using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Try to find user by email
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
    console.log(req.body);

    if (!idToken) {
      errorResponse(res, Status.BAD_REQUEST, 'No idToken provided');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const name = decodedToken.name;
    const picture = decodedToken.picture;
    const email = decodedToken.email;

    console.log(name, picture, email);

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
    console.log(user);

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

    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP Error:', error);
      } else {
        console.log('SMTP Server is ready');
      }
    });
    const mailOption = sendOtpEmail(email, otp);
    console.log(mailOption);
    const info = await transporter.sendMail(mailOption);
    console.log('Email sent:', info.messageId);

    return successResponse(res, Status.OK, 'OTP sent successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const verifyOtpService = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    const user = await User.findOne({ email });
    console.log(user, user.passwordReset?.otpHash);

    if (!user || !user.passwordReset?.otpHash) {
      return errorResponse(res, Status.BAD_REQUEST, 'OTP not found');
    }

    const reset = user.passwordReset;

    if (reset.otpExpiresAt < new Date()) {
      return errorResponse(res, Status.BAD_REQUEST, 'OTP expired');
    }

    if (reset.attempts >= 3) {
      reset.blockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      return errorResponse(res, Status.TOO_MANY_REQUESTS, 'Too many attempts');
    }

    const isValid = await bcrypt.compare(otp, reset.otpHash);

    if (!isValid) {
      reset.attempts += 1;
      await user.save();
      return errorResponse(res, Status.BAD_REQUEST, 'Invalid OTP');
    }
    user.passwordReset = {
      otpHash: null,
      otpExpiresAt: null,
      sendCount: 0,
      attempts: 0,
      blockedUntil: null,
      firstSendAt: null,
    };
    await user.save();
    return successResponse(res, Status.OK, 'OTP verified successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, Status.INTERNAL_SERVER_ERROR, 'Server error');
  }
};

export const passwordUpdate = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return errorResponse(
        res,
        Status.BAD_REQUEST,
        'Email and password are required',
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, Status.NOT_FOUND, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 11);

    user.password = hashedPassword;
    await user.save();

    return successResponse(res, Status.OK, 'Password updated successfully');
  } catch (err) {
    console.error('Password Update Error:', err);
    return errorResponse(
      res,
      Status.INTERNAL_SERVER_ERROR,
      'Internal server error',
    );
  }
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
