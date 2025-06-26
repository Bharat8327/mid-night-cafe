import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { success, error } from '../utils/responseWrapper.js';
import admin from 'firebase-admin';

export const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    // Validate input
    if (!name || !email || !password || !phone || !role) {
      return res.json(error(400, 'All fields are required.'));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(error(400, 'User already exists.'));
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    return res.json(success(201, 'User created successfully'));
  } catch (e) {
    return res.json(error(500, 'Internal server error.'));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.json(error(400, 'Email and password are required.'));
    }
    // Check if user exists
    const isExist = await User.findOne({ email }).populate('password');
    if (!isExist) {
      return res.json(error(404, 'User Not Found'));
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      return res.json(error(401, 'Invalid Password'));
    }
    //genrate web token and refresh token
    const accessToken = genrateWebToken({
      _id: isExist._id,
      email,
      role: isExist.role,
    });
    const refreshToken = genrateRefreshToken({
      _id: isExist._id,
      email,
      role: isExist.role,
    });

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false });
    return res.send(
      success(200, {
        accessToken,
      }),
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
};
// Google Authentication Controller
export const authWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      // If idToken is not provided, return error
      return res.json(error(400, 'No idToken provided'));
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
    const accessToken = generateWebToken({
      _id: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      email: user.email,
    });

    // Set refresh token in cookie
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false });

    // Send access token in response
    return res.send(
      success(200, {
        accessToken,
      }),
    );
  } catch (err) {
    // Handle errors
    return res.json(error(500, err.message));
  }
};

export const authWithgit = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      // If idToken is not provided, return error
      return res.json(error(400, 'No idToken provided'));
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
      const password = await bcrypt.hash(`google-auth ${year}`, 12);

      user = new User({
        name: name || 'No Name',
        email,
        password,
      });
      await user.save();
    }

    // Generate access and refresh tokens
    const accessToken = generateWebToken({
      _id: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      email: user.email,
    });

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false });
    // Send access token in response
    return res.send(
      success(200, {
        accessToken,
      }),
    );
  } catch (error) {
    console.log(error.message);
  }
};

// this refresh token check validity of and genrate a new access token
export const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.json(error(401, 'Refresh token is required'));
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);
    const { _id, email } = decoded;
    const accessToken = generateWebToken({ _id, email });
    return res.json(success(200, { accessToken }));
  } catch (e) {
    return res.json(error(401, 'Invalid Refresh token'));
  }
};

function generateWebToken(data) {
  try {
    return jwt.sign(data, config.jwt.secret, {
      expiresIn: '1d',
    });
  } catch (error) {
    console.log(error);
  }
}

function generateRefreshToken(data) {
  try {
    return jwt.sign(data, config.jwt.secret, {
      expiresIn: '1y',
    });
  } catch (error) {
    console.log(error);
  }
}
