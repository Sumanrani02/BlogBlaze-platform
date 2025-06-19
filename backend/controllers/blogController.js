import mongoose from 'mongoose'; 
import Blog from '../models/Blog.js';
import Post from "../models/Post.js";
import cloudinary from '../utils/cloudinary.js';

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, isFeatured } = req.body;

    if (!title || !content || !category || !req.file) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Upload to Cloudinary
    const imageUrl = req.file.path;

    const blog = await Blog.create({
      title,
      content,
      image: imageUrl, // Save Cloudinary image URL
      category,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      author: req.user._id,
    });

    res.status(201).json({ message: "Blog created successfully", post: blog });
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get blogs created by the logged-in user
export const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user blogs' });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID format' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching blog:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user._id;
    const liked = blog.likes.includes(userId);

    if (liked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete blog (Admin or Author)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Featured Posts
export const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3);
    res.json(posts);
  } catch (err) {
    console.error("Error in getFeaturedPosts:", err.stack); // ✅ log full stack
    res.status(500).json({ message: "Failed to fetch featured posts" });
  }
};

// Get Recent Posts
export const getRecentPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 }).limit(6);
    res.json(posts);
  } catch (err) {
    console.error("Error in getRecentPosts:", err.stack); // ✅ log full stack
    res.status(500).json({ message: "Failed to fetch recent posts" });
  }
};
