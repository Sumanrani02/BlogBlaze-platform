import mongoose from 'mongoose'; 
import Blog from '../models/Blog.js';
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
      const post = await Blog.findById(id)
  .populate('author', 'username')
  .populate('comments.author', 'username avatarUrl'); // ✅ includes user data in comments

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

    const userId = req.user._id.toString();
    const alreadyLiked = blog.likedBy.map(id => id.toString()).includes(userId);

    if (alreadyLiked) {
      blog.likedBy = blog.likedBy.filter(id => id.toString() !== userId);
    } else {
      blog.likedBy.push(req.user._id);
    }

    await blog.save();
res.json({
  likes: blog.likedBy.map(id => id.toString()), // ensures frontend gets clean strings
  liked: blog.likedBy.some(id => id.toString() === userId.toString()),
});

  } catch (err) {
    console.error("❌ Toggle like error:", err);
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
    res.json({ message: 'Blog deleted', deletedId: blog._id });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get top featured posts (most liked + most commented)

export const getFeaturedPosts = async (req, res) => {
  try {
    const blog = await Blog.find({})
      .populate('author', 'username') // optional
      .lean(); // make results easier to sort

    const featured = blog
      .map(blog => ({
        ...blog,
        totalEngagement: (blog.likedBy?.length || 0) + (blog.comments?.length || 0),
      }))
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 3); // top 6

    res.status(200).json(featured);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// Get Recent Posts
// Get Recent Posts
export const getRecentPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("author", "username"); // ✅ FIXED

    res.json(posts);
  } catch (err) {
    console.error("Error in getRecentPosts:", err.stack);
    res.status(500).json({ message: "Failed to fetch recent posts" });
  }
};


