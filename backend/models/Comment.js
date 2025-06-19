import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  date: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  category: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [commentSchema],
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;