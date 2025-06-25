import express from 'express';
import { getProfile, updateUserProfile, updatePassword,deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, updatePassword);
router.delete('/me', protect, deleteAccount);

export default router;
