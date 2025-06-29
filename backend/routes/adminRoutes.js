import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { getAllUsers , getAllBlogs , getAllComments , deleteAnyBlog,
  deleteAnyComment,
 deleteAnyUser } from '../controllers/admincontroller.js';

const router = express.Router();

// Get all users
router.get("/users", protect , isAdmin ,getAllUsers);
router.get("/blogs", protect , isAdmin ,getAllBlogs);
router.get("/comments", protect , isAdmin ,getAllComments);
router.delete("/blogs/:id", protect, isAdmin, deleteAnyBlog);
router.delete("/comments/:id", protect, isAdmin, deleteAnyComment);
router.delete("/users/:id", protect, isAdmin, deleteAnyUser);

export default router;