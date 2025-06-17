import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const hashed = await bcrypt.hash(req.body.password, 10);
    user.password = hashed;
  }

  await user.save();
  res.json({ message: 'Profile updated' });
};

export const deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Your account has been deleted' });
};
