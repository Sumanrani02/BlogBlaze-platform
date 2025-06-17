import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  category: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
