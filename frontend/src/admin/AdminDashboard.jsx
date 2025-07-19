import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  Eye,
  AlertCircle,
} from "lucide-react";

import { fetchAdminData, deleteAdminItem } from "../redux/adminSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth || { isAuthenticated: true, loading: false }
  );

  const { users, blogs, comments, loading: adminLoading, error: adminError } = useSelector(
    (state) => state.admin
  );

  const [activeTab, setActiveTab] = useState("users"); // 'users', 'blogs', 'comments'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
    isLoading: false,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      toast.error("You must be logged in as an administrator to view this page.");
      navigate("/login");
    } else {
      dispatch(fetchAdminData(activeTab));
    }
  }, [isAuthenticated, authLoading, navigate, activeTab, dispatch]);

  const handleDelete = (itemType, itemId) => {
    let title = "";
    let message = "";

    if (itemType === "user") {
      title = "Delete User";
      message =
        "Are you absolutely sure you want to delete this user? This action is irreversible and all their associated data (blogs, comments) will be permanently removed.";
    } else if (itemType === "blog") {
      title = "Delete Blog";
      message =
        "Are you absolutely sure you want to delete this blog post? This action is irreversible and all its associated comments will be permanently removed.";
    } else if (itemType === "comment") {
      title = "Delete Comment";
      message =
        "Are you absolutely sure you want to delete this comment? This action is irreversible.";
    }

    setModalConfig({
      title,
      message,
      confirmText: `Yes, Delete ${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      }`,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          await dispatch(deleteAdminItem({ itemType, itemId })).unwrap();
        } finally {
          setIsModalOpen(false);
          setModalConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
      isLoading: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalConfig((prev) => ({ ...prev, isLoading: false }));
  };

  // Check authentication and loading states
  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter">
          <Spinner className="h-16 w-16 text-blue-base animate-spin-slow" />
          <p className="mt-4 text-2xl font-bold text-blue-darker animate-pulse">
            Authenticating and loading admin dashboard...
          </p>
        </div>
        <Footer />
      </>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>

      <Navbar />

      <main className="flex-grow container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-6xl z-10 relative">
        <h1 className="text-6xl font-extrabold text-blue-darker mb-12 text-center leading-tight tracking-wider drop-shadow-lg animate-fade-in">
          <ShieldCheck className="inline-block h-16 w-16 mr-4 text-green-base" />{" "}
          Welcome Admin
        </h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-3xl shadow-xl p-4 flex flex-wrap justify-center gap-4 border-b-2 border-blue-base relative z-20">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center ${
              activeTab === "users"
                ? "bg-blue-base text-offwhite shadow-md"
                : "text-blue-darker hover:bg-blue-50"
            }`}
          >
            <User className="inline-block h-6 w-6 mr-3" /> Manage Users
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center ${
              activeTab === "blogs"
                ? "bg-blue-base text-offwhite shadow-md"
                : "text-blue-darker hover:bg-blue-50"
            }`}
          >
            <BookOpen className="inline-block h-6 w-6 mr-3" /> Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center ${
              activeTab === "comments"
                ? "bg-blue-base text-offwhite shadow-md"
                : "text-blue-darker hover:bg-blue-50"
            }`}
          >
            <MessageSquare className="inline-block h-6 w-6 mr-3" /> Manage
            Comments
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8 md:p-12 border-t-0 border-blue-base min-h-[500px] relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-pink-50/50 opacity-40 rounded-b-3xl"></div>{" "}
          {/* Gradient for content area */}
          {adminLoading ? (
            <div className="flex justify-center items-center h-full min-h-[300px] relative z-10">
              <Spinner className="h-16 w-16 text-blue-base animate-spin-slow" />
              <p className="ml-4 text-2xl font-bold text-blue-darker animate-pulse">
                Loading {activeTab} data...
              </p>
            </div>
          ) : adminError ? (
            <div className="flex flex-col justify-center items-center h-full min-h-[300px] relative z-10">
              <AlertCircle className="h-20 w-20 text-red-500 mb-4" />
              <p className="text-red-600 text-xl font-semibold text-center">
                {adminError}
              </p>
              <p className="text-gray-600 mt-2 text-center">
                Please try switching tabs or refreshing the page.
              </p>
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Users
                  </h2>
                  {users.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                      <table className="min-w-full bg-offwhite">
                        <thead>
                          <tr className="bg-blue-light text-offwhite text-left text-sm font-semibold uppercase tracking-wider rounded-t-xl">
                            <th className="py-4 px-6 rounded-tl-xl">
                              Username
                            </th>
                            <th className="py-4 px-6">Email</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Member Since</th>
                            <th className="py-4 px-6 rounded-tr-xl text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user._id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <td className="py-3 px-6 text-blue-darker font-medium">
                                {user.username}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {user.email}
                              </td>
                              <td className="py-3 px-6 text-blue-darker capitalize">
                                {user.role}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {user.memberSince}
                              </td>
                              <td className="py-3 px-6 text-center">
                                <button
                                  onClick={() => handleDelete("user", user._id)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors duration-200 transform hover:scale-110"
                                  title="Delete User"
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
                    <p className="text-blue-darker text-center py-8 text-xl">
                      No users found.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "blogs" && (
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Blog Posts
                  </h2>
                  {blogs.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                      <table className="min-w-full bg-offwhite">
                        <thead>
                          <tr className="bg-blue-light text-offwhite text-left text-sm font-semibold uppercase tracking-wider rounded-t-xl">
                            <th className="py-4 px-6 rounded-tl-xl">Title</th>
                            <th className="py-4 px-6">Author</th>
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6 rounded-tr-xl text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((blog) => (
                            <tr
                              key={blog._id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <td className="py-3 px-6 text-blue-darker font-medium">
                                {blog.title}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {blog.author?.username || "N/A"}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {blog.category || "General"}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {blog.date}
                              </td>
                              <td className="py-3 px-6 text-center space-x-2 flex justify-center items-center">
                                <Link
                                  to={`/posts/${blog._id}`}
                                  target="_blank"
                                  className="p-2 bg-blue-base text-white rounded-full hover:bg-blue-dark shadow-sm transition-colors duration-200 transform hover:scale-110"
                                  title="View Blog"
                                >
                                  <Eye className="h-5 w-5" />
                                </Link>
                                <button
                                  onClick={() => handleDelete("blog", blog._id)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors duration-200 transform hover:scale-110"
                                  title="Delete Blog"
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
                    <p className="text-blue-darker text-center py-8 text-xl">
                      No blog posts found.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-blue-darker mb-6">
                    Manage Comments
                  </h2>
                  {comments.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                      <table className="min-w-full bg-offwhite">
                        <thead>
                          <tr className="bg-blue-light text-offwhite text-left text-sm font-semibold uppercase tracking-wider rounded-t-xl">
                            <th className="py-4 px-6 rounded-tl-xl">Comment</th>
                            <th className="py-4 px-6">Author</th>
                            <th className="py-4 px-6">On Blog</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6 rounded-tr-xl text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comments.map((comment) => (
                            <tr
                              key={comment._id}
                              className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <td className="py-3 px-6 text-blue-darker max-w-xs overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                                {comment.text}{" "}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {comment.author?.username || "N/A"}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {comment.post?.title || "Unknown Post"}
                              </td>
                              <td className="py-3 px-6 text-blue-darker">
                                {comment.date}
                              </td>
                              <td className="py-3 px-6 text-center">
                                <button
                                  onClick={() =>
                                    handleDelete("comment", comment._id)
                                  }
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors duration-200 transform hover:scale-110"
                                  title="Delete Comment"
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
                    <p className="text-blue-darker text-center py-8 text-xl">
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