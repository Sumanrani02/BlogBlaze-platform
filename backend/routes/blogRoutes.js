import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getFeaturedPosts,
  getRecentPosts,
  getUserBlogs,
  getBlogById,
  toggleLike,
  deleteBlog
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get("/featured", getFeaturedPosts);
router.get("/recent", getRecentPosts);  
router.get('/user', protect, getUserBlogs);
router.get('/:id', getBlogById);

router.post('/', protect, upload.single('image'), createBlog);
router.patch('/:id/like', protect, toggleLike);
router.delete('/:id', protect, deleteBlog);

export default router;
