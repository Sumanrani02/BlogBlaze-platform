import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Trigger Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback
router.get('/google/callback',
  passport.authenticate('google', { session: false }), // disable session
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // payload
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

export default router;
