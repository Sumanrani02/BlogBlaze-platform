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
  Mail,
  Calendar,
  Edit,
  KeyRound,
  Trash,
  Save,
  XCircle,
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
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
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
      fetchAdminProfile();
      fetchData(activeTab);
    }
  }, [isAuthenticated, authLoading, navigate, activeTab]);

  const fetchAdminProfile = async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const response = await axios.get(`${API_BASE_URL}/users/profile`, config);
      setUserProfile(response.data);
      setEditedUsername(response.data.username);
      setEditedEmail(response.data.email);
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
      setPageError("Failed to load your profile. Please try again.");
      toast.error("Failed to load admin profile.");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      if (tab === "users") {
        const response = await axios.get(`${API_BASE_URL}/admin/users`, config);
        setUsers(response.data);
      } else if (tab === "blogs") {
        const response = await axios.get(`${API_BASE_URL}/admin/blogs`, config);
        setBlogs(response.data);
      } else if (tab === "comments") {
        const response = await axios.get(
          `${API_BASE_URL}/admin/comments`,
          config
        );
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
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          };

          await axios.delete(`${API_BASE_URL}/admin/users/${itemId}`, config);
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== itemId)
          );
          toast.success("User deleted successfully.");
        } catch (err) {
          console.error("Delete user error:", err);
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
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          };
          await axios.delete(`${API_BASE_URL}/admin/blogs/${itemId}`, config);
          setBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog.id !== itemId)
          );
          toast.success("Blog deleted successfully.");
        } catch (err) {
          console.error("Delete blog error:", err);
          toast.error(err.response?.data?.message || "Failed to delete blog.");
        } finally {
          setIsModalOpen(false);
        }
      };
    } else if (itemType === "comment") {
      title = "Delete Comment";
      message = "Are you sure you want to delete this comment?";
      confirmAction = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };
        try {
          await axios.delete(
            `${API_BASE_URL}/admin/comments/${itemId}`,
            config
          );
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== itemId)
          );
          toast.success("Comment deleted successfully.");
        } catch (err) {
          console.error("Delete comment error:", err);
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setPageLoading(true);
    setPageError(null);

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editedUsername,
          email: editedEmail,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      const updatedUser = await res.json();
      setUserProfile({
        ...updatedUser,
        memberSince: new Date(updatedUser.createdAt).toLocaleDateString(
          "en-IN",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      setPageError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!userProfile?._id) return;
    setModalConfig({
      title: "Delete Profile",
      message:
        "Are you sure you want to delete your profile? This action cannot be undone.",
      confirmText: "Delete",
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          const res = await fetch(`${API_BASE_URL}/users/me`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          if (!res.ok) throw new Error("Failed to delete the user.");
          toast.success("Your account has been successfully deleted.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } catch (err) {
          console.error("Error during user deletion:", err);
          toast.error("Failed to delete your account. Please try again.");
        } finally {
          setModalConfig((prev) => ({ ...prev, isLoading: false }));
          setIsModalOpen(false);
        }
      },
      isLoading: false,
    });
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditedUsername(userProfile.username);
      setEditedEmail(userProfile.email);
    }
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
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

        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-pink-base">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXlq_0NnSV8hKKuokYeyhIO_PG-K6APYIHA&s"
                } // Fallback for avatar
                alt={`Admin's avatar`}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-base shadow-md"
              />
            </div>

            {/* User Details / Edit Form */}
            <div className="flex-grow text-center md:text-left">
              {!isEditing ? (
                // Display Mode
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-blue-base">
                    {userProfile.username}
                  </h2>
                  <p className="text-blue-darker flex items-center justify-center md:justify-start text-lg">
                    <Mail className="h-5 w-5 mr-2 text-blue-light" />{" "}
                    {userProfile.email}
                  </p>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-light" /> Member
                    since: {userProfile.memberSince || "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 inline-flex items-center px-6 py-2 bg-pink-base text-blue-base font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </button>
                    <button
                      onClick={handleChangePasswordClick}
                      className="mt-4 ml-3 inline-flex items-center px-6 py-2 bg-blue-light text-offwhite font-semibold rounded-full shadow-md hover:bg-blue-base transition-colors duration-300 transform hover:scale-105"
                    >
                      <KeyRound className="h-4 w-4 mr-2" /> Change Password
                    </button>
                    {/* New: Delete Profile Button */}
                    <button
                      onClick={handleDeleteProfile}
                      className="mt-4 ml-3 inline-flex items-center px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition-colors duration-300 transform hover:scale-105"
                    >
                      <Trash className="h-4 w-4 mr-2" /> Delete Profile
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label
                      htmlFor="edit-username"
                      className="block text-blue-darker text-sm font-bold mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="edit-username"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
                      required
                      disabled={pageLoading} // Disable inputs during save
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-email"
                      className="block text-blue-darker text-sm font-bold mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
                      required
                      disabled={pageLoading}
                    />
                  </div>
                  <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 bg-blue-base text-pink-base font-semibold rounded-full shadow-md hover:bg-blue-dark transition-colors duration-300 transform hover:scale-105"
                      disabled={pageLoading}
                    >
                      {pageLoading ? (
                        <Spinner className="h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}{" "}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-6 py-2 bg-pink-darker text-offwhite font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
                      disabled={pageLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </button>
                  </div>
                  {pageError && (
                    <p className="text-red-600 text-sm mt-2 text-center md:text-left">
                      {pageError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

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
                              key={user._id}
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
                                  onClick={() => handleDelete("user", user._id)}
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
