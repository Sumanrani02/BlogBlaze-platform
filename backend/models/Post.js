import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  imageUrl: String,
  category: String,
  author: String,
  date: String,
  tags: [String],
  likes: Number,
  comments: [
    {
      author: String,
      text: String,
      date: String,
    },
  ],
});

const Post = mongoose.model('Post', postSchema, 'blogs'); // <- 'blogs' is the collection name in MongoDB

export default Post;
