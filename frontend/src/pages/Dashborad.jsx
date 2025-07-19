import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BookOpen, MessageCircle, PlusCircle, Trash } from "lucide-react";
import Spinner from "../component/common/Spinner";
import BlogPostCard from "../blog/BlogPostCard";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import { deleteBlog, getUserBlogs } from "../redux/blogSlice";
import { fetchUserComments, deleteComment } from "../redux/commentSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { blogs, loading: blogLoading } = useSelector((state) => state.blogs);
  const { comments, loading: commentLoading } = useSelector(
    (state) => state.comments
  );
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authoredPosts = blogs.filter(
    (blog) =>
      blog.author === user?.username ||
      blog.author === "Current User" ||
      blog.author?._id === user?._id ||
      blog.author?.username === user?.username
  );

  useEffect(() => {
  if (!isAuthenticated) {
    setLoading(false);
    return;
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(getUserBlogs());
      await dispatch(fetchUserComments());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [isAuthenticated, dispatch]);

  const handleDeletePost = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }
    
    try {
      const result = await dispatch(deleteBlog(postId));

      if (deleteBlog.fulfilled.match(result)) {
        toast.success("Blog post deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete the blog post. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await dispatch(deleteComment(commentId))
      setUserComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter">
          <Spinner className="h-16 w-16 text-blue-base animate-spin-slow" />
          <p className="mt-4 text-2xl font-bold text-blue-darker animate-pulse">
            Gathering your dashboard insights...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-orange-50 font-inter p-4">
          <p className="text-red-700 text-2xl font-extrabold text-center">
            Oops! Something went wrong.
          </p>
          <p className="text-red-500 text-lg mt-3 text-center">{error}</p>
          <p className="text-gray-600 mt-5 text-center">
            Please refresh the page or try again later. If the problem persists,
            contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-blue-base text-white font-semibold rounded-full shadow-lg hover:bg-blue-dark transition-all duration-300 transform hover:scale-105"
          >
            Refresh Page
          </button>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>

      <Navbar />

      <main className="flex-grow container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-6xl z-10 relative">
        <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-pink-base transform transition-all duration-500 hover:scale-[1.005] hover:shadow-3xl relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-blue-50/50 opacity-40 rounded-3xl"></div>
          <h2 className="text-4xl font-extrabold text-blue-darker mb-8 text-center flex items-center justify-center relative z-10">
            <BookOpen className="h-10 w-10 mr-4 text-pink-darker" /> My Blog
            Posts
          </h2>
          {authoredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
              {authoredPosts.map((post) => (
                <div key={post._id} className="relative group">
                  <BlogPostCard post={post} />
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform scale-0 group-hover:scale-100 origin-top-right focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                    title="Delete Post"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-blue-darker relative z-10">
              <p className="text-3xl font-bold mb-6">
                You haven't published any posts yet!
              </p>
              <Link
                to="/create-blog"
                className="inline-flex items-center px-6 py-3 bg-blue-base text-offwhite font-semibold rounded-full shadow-md hover:bg-blue-dark transition-all duration-300 transform hover:scale-105 group"
              >
                <PlusCircle className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create your first blog post
              </Link>
            </div>
          )}
        </section>

        {/* User Comments Section */}
        <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-base transform transition-all duration-500 hover:scale-[1.005] hover:shadow-3xl relative overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-pink-50/50 opacity-40 rounded-3xl"></div>
          <h2 className="text-4xl font-extrabold text-blue-darker mb-8 text-center flex items-center justify-center relative z-10">
            <MessageCircle className="h-10 w-10 mr-4 text-blue-darker" /> My
            Comments
          </h2>
          {comments.length > 0 ? (
            <ul className="space-y-6 relative z-10">
              {comments.map((comment) => (
                <li
                  key={comment._id}
                  className="p-6 bg-pink-light rounded-xl shadow-md relative border border-pink-darker transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                >
                  <p className="text-blue-darker text-xl font-medium mb-3">
                    "{comment.text}"
                  </p>
                  <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700">
                    <span className="mb-2 sm:mb-0">
                      Commented on:{" "}
                      <Link
                        to={`/blog/${comment.post?._id}`}
                        className="text-blue-base hover:underline font-semibold"
                      >
                        {comment.post?.title || "Unknown Post"}
                      </Link>
                    </span>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <Trash className="h-4 w-4 mr-2" /> Delete Comment
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-blue-darker relative z-10">
              <p className="text-2xl font-semibold">
                You haven't commented on any posts yet!
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
