import Blog from '../models/Blog.js';
import cloudinary from '../utils/cloudinary.js';

// Create new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return res.status(500).json({ message: error.message });
          imageUrl = result.secure_url;

          saveBlog(); // Call inner function after upload
        }
      );
      req.pipe(req.file.stream).pipe(result);
    } else {
      saveBlog();
    }

    async function saveBlog() {
      const blog = await Blog.create({
        title,
        content,
        image: imageUrl,
        category,
        author: req.user._id,
      });
      res.status(201).json(blog);
    }

  } catch (err) {
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

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
