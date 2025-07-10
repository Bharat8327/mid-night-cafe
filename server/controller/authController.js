import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { successResponse, errorResponse } from '../utils/responseWrapper.js';
import Status from '../utils/statusCode.js';
import message from '../utils/message.js';

import admin from 'firebase-admin';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    // Validate input
    console.log(req.body);

    if (!name || !email || !password || !phone || !role) {
      errorResponse(res, Status.BAD_REQUEST, message[400]);
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      errorResponse(res, Status.BAD_REQUEST, 'User already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    console.log('commes');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await newUser.save();
    console.log('save success');

    successResponse(res, Status.CREATED, 'User created successfully');
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
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
    // Check if user exists
    const isExist = await User.findOne({ email }).populate('password');
    if (!isExist) {
      errorResponse(res, Status.NOT_FOUND, message[404]);
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      errorResponse(res, Status.UNAUTHORIZED, 'Invalud Password');
    }
    //genrate web token and refresh token
    const token = genrateWebToken({
      id: isExist._id,
      email,
      name: isExist.name,
      role: isExist.role,
    });
    // Removed 'refreshToken' as it was declared but never used
    // Set the JWT token in a cookie named 'myCookie'
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
// Google Authentication Controller
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
      // If user does not exist, create a new user
      // Generate a random year-based string for password (not used for login)
      const year =
        new Date().getFullYear() + Math.floor(Math.random() * 1000 + 12);
      // Hash the generated password
      const password = await bcrypt.hash(`google-auth ${year}`, 12);

      user = new User({
        name: decodedToken.name || 'No name',
        email: decodedToken.email,
        password,
      });
      await user.save();
    }

    // Generate access and refresh tokens
    const accessToken = genrateWebToken({
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

    // Set refresh token in cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000,
    });

    // Send access token in response
    successResponse(res, Status.OK, message[200], {
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    // Handle errors
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const authWithgit = async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log(req.body);

    if (!idToken) {
      // If idToken is not provided, return error
      errorResponse(res, Status.BAD_REQUEST, 'No idToken provided');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const name = decodedToken.name;
    const picture = decodedToken.picture;
    const email = decodedToken.email;

    console.log(name, picture, email);

    let user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, create a new user
      // Generate a random year-based string for password (not used for login)
      const year =
        new Date().getFullYear() + Math.floor(Math.random() * 1000 + 12);
      // Hash the generated password
      const password = await bcrypt.hash(`github-auth ${year}`, 12);

      user = new User({
        name: name || 'No Name',
        email,
        password,
      });
      await user.save();
    }

    // Generate access and refresh tokens
    const accessToken = genrateWebToken({
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

    res.cookie('myCookie', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 900000,
    });
    // Send access token in response
    console.log(user);

    successResponse(res, Status.OK, message[200], {
      authenticated: true,
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    errorResponse(res, Status.INTERNAL_SERVER_ERROR, err.message);
  }
};

// this refresh token check validity of and genrate a new access token
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
