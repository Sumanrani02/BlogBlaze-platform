import express from 'express';
import {
  addComment,
  getCommentsByBlog,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:blogId', getCommentsByBlog);
router.post('/:blogId', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
