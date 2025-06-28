import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Spinner from "../component/common/Spinner";
import ConfirmationModal from "../component/common/ConfirmationModal";
import {
  User,
  BookOpen,
  MessageSquare,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth || { isAuthenticated: true, loading: false }
  );
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users"); // 'users', 'blogs', 'comments'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
    isLoading: false,
  });

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      toast.error(
        "You must be logged in as an administrator to view this page."
      );
      navigate("/login");
    } else {
      fetchData(activeTab);
    }
  }, [isAuthenticated, authLoading, navigate, activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      if (tab === "users") {
        const response = await axios.get(`${API_BASE_URL}/users`);
        setUsers(response.data);
      } else if (tab === "blogs") {
        const response = await axios.get(`${API_BASE_URL}/blogs`);
        setBlogs(response.data);
      } else if (tab === "comments") {
        const response = await axios.get(`${API_BASE_URL}/comments`);
        setComments(response.data);
      }
    } catch (err) {
      setError(`Failed to load ${tab}. Please try again.`);
      toast.error(`Failed to load ${tab}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemType, itemId) => {
    let title = "";
    let message = "";
    let confirmAction;

    if (itemType === "user") {
      title = "Delete User";
      message = "Are you sure you want to delete this user?";
      confirmAction = async () => {
        try {
          await axios.delete(`${API_BASE_URL}/users/${itemId}`);
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== itemId)
          );
          toast.success("User deleted successfully.");
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete user.");
        } finally {
          setIsModalOpen(false);
        }
      };
    } else if (itemType === "blog") {
      title = "Delete Blog";
      message = "Are you sure you want to delete this blog?";
      confirmAction = async () => {
        try {
          await axios.delete(`${API_BASE_URL}/blogs/${itemId}`);
          setBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog.id !== itemId)
          );
          toast.success("Blog deleted successfully.");
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete blog.");
        } finally {
          setIsModalOpen(false);
        }
      };
    } else if (itemType === "comment") {
      title = "Delete Comment";
      message = "Are you sure you want to delete this comment?";
      confirmAction = async () => {
        try {
          await axios.delete(`${API_BASE_URL}/comments/${itemId}`);
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== itemId)
          );
          toast.success("Comment deleted successfully.");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete comment."
          );
        } finally {
          setIsModalOpen(false);
        }
      };
    }

    setModalConfig({
      title,
      message,
      confirmText: "Delete",
      onConfirm: confirmAction,
      isLoading: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig((prev) => ({ ...prev, isLoading: false }));
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">Authenticating...</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <Navbar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-5xl font-extrabold text-blue-darker mb-10 text-center leading-tight flex items-center justify-center">
          <ShieldCheck className="h-12 w-12 mr-4 text-green-base" /> Welcome
          Admin
        </h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-md p-4 flex justify-center border-b-2 border-blue-base">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 ${
              activeTab === "users"
                ? "bg-blue-base text-offwhite"
                : "text-blue-darker hover:bg-gray-100"
            }`}
          >
            <User className="inline-block h-5 w-5 mr-2" /> Users
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 ${
              activeTab === "blogs"
                ? "bg-blue-base text-offwhite"
                : "text-blue-darker hover:bg-gray-100"
            }`}
          >
            <BookOpen className="inline-block h-5 w-5 mr-2" /> Blogs
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-200 ${
              activeTab === "comments"
                ? "bg-blue-base text-offwhite"
                : "text-blue-darker hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="inline-block h-5 w-5 mr-2" /> Comments
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8  border-t-0 border-blue-base min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner className="h-16 w-16 text-blue-base" />
              <p className="ml-4 text-xl text-blue-darker">
                Loading {activeTab} data...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <div>
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Users
                  </h2>
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-offwhite rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-pink-light text-blue-darker text-left text-sm font-semibold uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-tl-lg">
                              Username
                            </th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Member Since</th>
                            <th className="py-3 px-4 rounded-tr-lg text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3 px-4 text-blue-darker">
                                {user.username}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {user.email}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {user.memberSince}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleDelete("user", user.id)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-blue-darker text-center py-8">
                      No users found.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "blogs" && (
                <div>
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Blog Posts
                  </h2>
                  {blogs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-offwhite rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-pink-light text-blue-darker text-left text-sm font-semibold uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-tl-lg">Title</th>
                            <th className="py-3 px-4">Author</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 rounded-tr-lg text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((blog) => (
                            <tr
                              key={blog.id}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3 px-4 text-blue-darker">
                                {blog.title}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {blog.authorName}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {blog.category}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {blog.date}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleDelete("blog", blog.id)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-blue-darker text-center py-8">
                      No blog posts found.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div>
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Comments
                  </h2>
                  {comments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-offwhite rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-pink-light text-blue-darker text-left text-sm font-semibold uppercase tracking-wider">
                            <th className="py-3 px-4 rounded-tl-lg">Comment</th>
                            <th className="py-3 px-4">Author</th>
                            <th className="py-3 px-4">Blog ID</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 rounded-tr-lg text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comments.map((comment) => (
                            <tr
                              key={comment.id}
                              className="border-b border-gray-200 last:border-b-0"
                            >
                              <td className="py-3 px-4 text-blue-darker max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {comment.content}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {comment.authorName}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {comment.blogId}
                              </td>
                              <td className="py-3 px-4 text-blue-darker">
                                {comment.date}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() =>
                                    handleDelete("comment", comment.id)
                                  }
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-blue-darker text-center py-8">
                      No comments found.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isLoading={modalConfig.isLoading}
      />
    </div>
  );
};

export default AdminDashboard;
