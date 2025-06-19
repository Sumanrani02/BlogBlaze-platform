import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Post from '../models/Comment.js';

const router = express.Router();

// Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete a user
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Delete a blog
router.delete('/blogs/:id', protect, isAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted by admin' });
});

// Delete a comment
router.delete('/post/:id', protect, isAdmin, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Comment deleted by admin' });
});

export default router;
