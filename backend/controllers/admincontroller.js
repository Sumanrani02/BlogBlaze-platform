import User from "../models/User.js";
import Blog from "../models/Blog.js";

// controller
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role createdAt").lean();
    const formatted = users.map(user => ({
      ...user,
      memberSince: new Date(user.createdAt).toISOString().split("T")[0]
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
// controller
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email") // populate author
      .select("title category createdAt author")
      .lean();

    const formatted = blogs.map(blog => ({
      id: blog._id,
      title: blog.title,
      category: blog.category,
      date: new Date(blog.createdAt).toISOString().split("T")[0],
      authorName: blog.author?.username || "Unknown", // SAFE access
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// controller
export const getAllComments = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('comments.author', 'username').lean();

    const comments = [];

    blogs.forEach(blog => {
      if (Array.isArray(blog.comments)) {
        blog.comments.forEach(comment => {
          comments.push({
            id: comment._id,
            content: comment.text || '', // use 'text' because that's how you save it
            date: comment.createdAt
              ? new Date(comment.createdAt).toISOString().split("T")[0]
              : comment._id.getTimestamp().toISOString().split("T")[0], // fallback
            authorName: comment.author?.username || "Unknown",
            blogTitle: blog.title || "Untitled",
            blogId: blog._id,
          });
        });
      }
    });

    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
// Delete any blog post (admin only)
export const deleteAnyBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Admin blog delete error:", err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

// Delete any comment (admin only)
// Delete embedded comment by ID (admin only)
export const deleteAnyComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    // Find the blog that contains the comment
    const blog = await Blog.findOne({ "comments._id": commentId });
    if (!blog) return res.status(404).json({ message: "Comment not found" });

    // Remove the comment from the blog
    blog.comments = blog.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Admin comment delete error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

export const deleteAnyUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Delete all blogs authored by this user
    await Blog.deleteMany({ author: userId });

    // 3. Remove user's embedded comments from all blogs
    await Blog.updateMany(
      {},
      { $pull: { comments: { author: userId } } }
    );

    res.json({ message: "User and their content deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
