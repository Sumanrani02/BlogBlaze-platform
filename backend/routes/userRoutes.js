import express from 'express';
import { getProfile, updateUserProfile, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/me', protect, deleteAccount);

export default router;
