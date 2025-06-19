import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  content: { type: String, required: true },
  image: { type: String }, // ✅ This holds the Cloudinary URL
  isFeatured: { type: Boolean, default: false }, // ✅ Add this line
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // if used
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
