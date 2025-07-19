import User from '../models/User.js';
import Blog from '../models/Blog.js';
import bcrypt from 'bcryptjs';


export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// controllers/userController.js
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt
  });
};



export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete all blogs authored by this user
    await Blog.deleteMany({ author: userId });

    // 2. Remove this user's comments from all blogs
    await Blog.updateMany(
      { "comments.author": userId },
      { $pull: { comments: { author: userId } } }
    );

    // 3. Delete the user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User, blogs, and comments deleted successfully" });
  } catch (error) {
    console.error("Error deleting user and associated data:", error);
    res.status(500).json({ message: "Server error during user deletion" });
  }
};


export const updatePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide both current and new password" });
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};






