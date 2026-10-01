import User from '../models/User.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found.', [], 404);
    }

    return successResponse(res, 'Profile loaded successfully.', { user });
  } catch (error) {
    return errorResponse(res, 'Unable to load profile.', [error.message], 500);
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return successResponse(res, 'Users retrieved successfully.', { users });
  } catch (error) {
    return errorResponse(res, 'Unable to fetch users.', [error.message], 500);
  }
};
