import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'pine-city-made-dev-secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'client', phone = '', address = '', barangay = '' } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required.', [], 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 'A user with this email already exists.', [], 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      address,
      barangay,
      accountStatus: role === 'seller' ? 'Pending' : 'Approved',
    });

    const token = generateToken(user);

    return successResponse(
      res,
      'Account created successfully.',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
        },
      },
      201,
    );
  } catch (error) {
    return errorResponse(res, 'Unable to create account.', [error.message], 500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', [], 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', [], 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', [], 401);
    }

    const token = generateToken(user);

    return successResponse(res, 'Login successful.', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    return errorResponse(res, 'Unable to login.', [error.message], 500);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found.', [], 404);
    }

    return successResponse(res, 'User profile loaded.', { user });
  } catch (error) {
    return errorResponse(res, 'Unable to load user profile.', [error.message], 500);
  }
};
