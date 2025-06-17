import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';

// Add comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: blogId
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get comments by blog
export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
