import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required.', [], 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pine-city-made-dev-secret');
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token.', [], 401);
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required.', [], 401);
  }

  if (req.user.role !== role) {
    return errorResponse(res, 'You do not have permission to access this resource.', [], 403);
  }

  return next();
};

export const requireAdmin = requireRole('admin');
export const requireSeller = requireRole('seller');
export const requireClient = requireRole('client');
