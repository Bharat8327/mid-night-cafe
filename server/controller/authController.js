import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/config.js';
import { success, error } from '../utils/responseWrapper.js';
import admin from 'firebase-admin';
import { decode } from 'jsonwebtoken';

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
    const hashedPassword = await bcrypt.hash(password, 12);
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
    const { email, password } = req.body;
    // Validate input
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
    const accessToken = genrateWebToken({ _id: isExist._id, email });
    const refreshToken = genrateRefreshToken({ _id: isExist._id, email });

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

export const authWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.json(error(400, 'No idtoken provided'));
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken);
    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      user = new User({
        name: decodedToken?.name || 'No name',
        email: decodedToken?.email,
        password: 'gogle-auth',
      });
      await user.save();
    }
    const accessToken = genrateWebToken({
      _id: user._id,
      email: decodedToken?.email,
    });
    const refreshToken = genrateRefreshToken({
      _id: user._id,
      email: decodedToken?.email,
    });
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false });
    return res.send(
      success(200, {
        accessToken,
      }),
    );
  } catch (err) {
    return res.json(error(500, err.message));
  }
};

// this refresh token check validity of and genrate a new access token
export const refreshAcessTokenController = async (req, res) => {
  const cookies = req.cookies; // cookies throw access the refresh token // otherwise we are access throw the body for temporary ex=> const {refreshToken} req.body; this types throw access
  if (!cookies.jwt) {
    return res.send(error(401, 'Refresh token are required'));
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);
    const _id = decoded._id;
    const email = decoded.email;
    const accessToken = generateWebToken({ _id, email });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    return res.send(error(401, 'Invalid Refresh token'));
  }
};

function genrateWebToken(data) {
  try {
    const token = jwt.sign(data, config.jwt.secret, {
      expiresIn: '1d',
    });
    return token;
  } catch (error) {
    console.log(error);
  }
}

function genrateRefreshToken(data) {
  try {
    const token = jwt.sign(data, config.jwt.secret, {
      expiresIn: '1y',
    });
    return token;
  } catch (error) {
    console.log(error);
  }
}
