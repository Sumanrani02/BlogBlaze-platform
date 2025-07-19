import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  MessageSquare,
  Heart,
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Spinner from "../component/common/Spinner";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "../redux/blogSlice";
import { likePost, postComment } from "../redux/commentSlice";

const BlogDetailPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog, loading, error } = useSelector((state) => state.blogs);
  const { comments } = useSelector((state) => state.comments);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setLikes(blog.likedBy?.length || 0);
      setComment(blog.comments || []);

      // Check if current user liked the post
      if (user?._id && blog.likedBy) {
        const hasLiked = blog.likedBy.some((uid) => {
          const likeId = typeof uid === "string" ? uid : uid._id;
          return likeId === user._id;
        });
        setLiked(hasLiked);
      }
    }
  }, [blog, user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to copy current page URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to comment.");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    try {
      const resultAction = await dispatch(
        postComment({ postId: id, text: newComment })
      );

      if (postComment.fulfilled.match(resultAction)) {
        const comment = resultAction.payload;
        setComment((prev) => [...prev, comment]);
        setNewComment("");
        toast.success("Comment posted successfully!");
      } else {
        throw new Error(resultAction.payload || "Failed to post comment");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like the post.");
      return;
    }

    try {
      const resultAction = await dispatch(likePost(id));

      if (likePost.fulfilled.match(resultAction)) {
        const { liked, likes } = resultAction.payload;
        setLiked(liked);
        setLikes(likes?.length || 0);
        toast.success(liked ? "Post liked!" : "Post unliked!");
      } else {
        throw new Error(resultAction.payload || "Failed to like");
      }
    } catch (err) {
      console.error("Failed to like:", err);
      toast.error("Failed to like the post.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="animate-spin h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">Loading post...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <p className="text-blue-darker mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-blue-darker text-xl font-semibold">
            Post not found.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter overflow-x-hidden">
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl overflow-x-hidden">
        <article className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-pink-base">
          {/* Post Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/1200x600/offwhite/blue-darker?text=Blog+Image+Not+Found";
            }}
          />

          {/* Post Header */}
          <header className="mb-8 border-b pb-6 border-pink-light">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-darker mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center text-blue-darker text-sm gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-light" />
                <span>By {blog.author?.username || "Unknown Author"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-light" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-blue-light" />
                <span className="text-blue-base bg-pink-base px-2 py-0.5 rounded-full text-xs font-semibold">
                  {blog.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full cursor-pointer ${
                    liked ? "text-pink-darker" : "text-gray-400"
                  } hover:text-pink-base`}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                  />
                </button>
                <span className="text-blue-darker">{likes} Likes</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-blue-darker bg-pink-light px-3 py-1 rounded-full text-xs font-medium border border-pink-base"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Post Content - Using dangerouslySetInnerHTML for rich text */}
          <div
            className="prose prose-lg max-w-none text-blue-dark leading-relaxed overflow-x-hidden"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Social Share and Copy Link */}
          <div className="mt-10 pt-6 border-t border-pink-light flex flex-col sm:flex-row items-center justify-between gap-4">
            <h4 className="text-blue-base text-lg font-bold flex items-center">
              <Share2 className="h-5 w-5 mr-2" /> Share This Post:
            </h4>
            <div className="flex space-x-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-light text-white rounded-full hover:bg-blue-base transition-colors duration-200 shadow-md"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${
                  window.location.href
                }&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-lighter text-blue-darker rounded-full hover:bg-blue-light transition-colors duration-200 shadow-md"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${
                  window.location.href
                }&title=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-base text-white rounded-full hover:bg-blue-dark transition-colors duration-200 shadow-md"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <button
                onClick={handleCopyLink}
                className="relative p-3 bg-green-base text-white rounded-full hover:bg-blue-light transition-colors duration-200 shadow-md"
              >
                <Copy className="h-5 w-5" />
                {showCopiedMessage && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-dark text-pink-light text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 animate-fadeInOut">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t border-pink-base">
            <h3 className="text-3xl font-extrabold text-blue-darker mb-6 flex items-center">
              <MessageSquare className="h-7 w-7 mr-2 text-blue-light" />{" "}
              Comments ({blog.comments.length})
            </h3>
            <div className="space-y-6">
              {comments.length > 0 ? (
                comment.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-pink-light p-5 rounded-lg shadow-sm border border-pink-base"
                  >
                    <p className="font-semibold text-blue-base mb-1">
                      {comment.author?.username || "Unknown User"}
                    </p>
                    <p className="text-blue-darker text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-2">{comment.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-blue-darker text-center text-lg py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            {/* Comment Form - Placeholder for future functionality */}
            <div className="mt-8 pt-6 border-t border-pink-light">
              <h4 className="text-xl font-bold text-blue-base mb-4">
                Leave a Comment
              </h4>
              <form className="space-y-4" onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="5"
                  placeholder="Write your comment here..."
                  required
                  className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light resize-y"
                ></textarea>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-base text-pink-base font-bold rounded-full shadow-md hover:bg-blue-dark transition-colors duration-300 transform hover:scale-105"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
