import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true,
    },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  content: { type: String, required: true },
  image: { type: String }, // ✅ This holds the Cloudinary URL
  isFeatured: { type: Boolean, default: false }, // ✅ Add this line
  
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // if used
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: { type: [commentSchema], default: [] },
}, { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
