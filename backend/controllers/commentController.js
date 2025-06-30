import mongoose from 'mongoose'; 
import Blog from '../models/Blog.js';

// Add comment
export const addComment = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const userId = req.user?._id;

  if (!comment) {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const newComment = {
      text: comment,
      author: userId,
    };

    blog.comments.push(newComment);
    await blog.save();

    // Re-fetch blog with populated comments
    const updatedBlog = await Blog.findById(id).populate('comments.author', 'username avatarUrl');
    const lastComment = updatedBlog.comments[updatedBlog.comments.length - 1];

    res.status(201).json({ message: 'Comment added', comment: lastComment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};



export const getUserComments = async (req, res) => {
  try {
    const userId = req.user._id;

    const blogs = await Blog.find({ "comments.author": userId });

    // Flatten the comments made by the user across all blogs
    const userComments = blogs.flatMap(blog =>
      blog.comments
        .filter(comment => comment.author.toString() === userId.toString())
        .map(comment => ({
          ...comment.toObject(),
          postId: blog._id,
          postTitle: blog.title,
        }))
    );

    res.json(userComments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findOne({ "comments._id": commentId });
    if (!blog) {
      return res.status(404).json({ message: "Comment not found in any blog" });
    }

    const comment = blog.comments.id(commentId);

    // Check if user is author of the comment or admin
    if (comment.author.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete comment" });
    }

    // ✅ Correctly remove the subdocument
    blog.comments.pull(commentId);
    await blog.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};

