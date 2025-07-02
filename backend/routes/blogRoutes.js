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
import { addComment,getUserComments,deleteComment  } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();



// Blog routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedPosts);
router.get('/recent', getRecentPosts);
router.get('/user/comments', protect, getUserComments);
router.get('/user', protect, getUserBlogs);

// Comments
router.post('/:id/comments', protect, addComment);
router.delete('/comments/:id', protect, deleteComment);

// Blog CRUD
router.post('/', protect, upload.single('featuredImage'), createBlog);
router.post('/:id/like', protect, toggleLike);
router.get('/:id', getBlogById);
router.delete('/:id', protect, deleteBlog);

export default router;
