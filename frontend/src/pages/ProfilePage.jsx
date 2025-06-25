import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  Edit,
  Save,
  XCircle,
  BookOpen,
  KeyRound,
  MessageCircle,
  Trash,
} from "lucide-react";

import Spinner from "../component/common/Spinner";
import Navbar from "../layout/Navbar";
import BlogPostCard from "../blog/BlogPostCard";
import Footer from "../layout/Footer";

const ProfilePage = () => {
  const {
    isAuthenticated,
    user: reduxUser,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (authLoading) return setPageLoading(true);
    if (!isAuthenticated) return navigate("/login");

    const fetchProfileData = async () => {
      setPageLoading(true);
      setPageError(null);
      const token = localStorage.getItem("authToken");

      try {
        const [userRes, blogRes, commentsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          fetch(`${BASE_URL}/api/posts/user`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
          fetch(`${BASE_URL}/api/posts/user/comments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          }),
        ]);

        if (!userRes.ok || !blogRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const fetchedUser = await userRes.json();
        const userPosts = await blogRes.json();
        const userComments = await commentsRes.json();

        setUserProfile({
          ...fetchedUser,
          memberSince: new Date(fetchedUser.createdAt).toLocaleDateString(
            "en-IN",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
        });
        setAuthoredPosts(userPosts);
        setUserComments(userComments);
        setEditedUsername(fetchedUser.username);
        setEditedEmail(fetchedUser.email);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setPageError(
          err.message || "Failed to load profile. Please try again."
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, authLoading, reduxUser, navigate]);

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      if (!res.ok) throw new Error("Failed to delete the post.");

      setAuthoredPosts((prev) => prev.filter((post) => post._id !== postId));
      toast.success("Blog post deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the blog post. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      if (!res.ok) throw new Error("Failed to delete the comment.");

      setUserComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the comment. Please try again.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setPageLoading(true);
    setPageError(null);

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch(`${BASE_URL}/api/users/profile`, {
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

  if (pageLoading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">Loading profile...</p>
        </div>
      </>
    );
  }

  if (authError || pageError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-red-600 text-xl font-semibold">
            {authError || pageError}
          </p>
          <p className="text-blue-darker mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-5xl font-extrabold text-blue-darker mb-10 text-center leading-tight">
          My Profile
        </h1>
        {/* Profile Information Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-pink-base">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={
                  userProfile.avatarUrl ||
                  "https://placehold.co/150x150/blue-dark/pink-light?text=User"
                } // Fallback for avatar
                alt={`${userProfile.username}'s avatar`}
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

        {/* Authored Posts Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-pink-base">
          <h2 className="text-4xl font-extrabold text-blue-darker mb-8 text-center flex items-center justify-center">
            <BookOpen className="h-9 w-9 mr-3 text-green-base" /> My Blog Posts
          </h2>
          {authoredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {authoredPosts.map((post) => (
                <div key={post.id} className="relative">
                  <BlogPostCard post={post} />
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-blue-darker">
              <p className="text-2xl font-semibold mb-4">
                You haven't published any posts yet!
              </p>
              <p className="text-lg">
                Why not{" "}
                <Link
                  to="/create-blog"
                  className="text-blue-base bg-pink-light py-2 rounded-2xl px-2  hover:underline font-medium "
                >
                  create your first blog post
                </Link>
                ?
              </p>
            </div>
          )}
        </section>

        {/* User Comments Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10  border border-pink-base">
          <h2 className="text-4xl font-extrabold text-blue-darker mb-8 text-center flex items-center justify-center">
            <MessageCircle className="h-9 w-9 mr-3 text-blue-light" /> My
            Comments
          </h2>
          {userComments.length > 0 ? (
            <ul className="space-y-4">
              {userComments.map((comment) => (
                <li
                  key={comment._id}
                  className="p-4 bg-pink-light rounded-lg shadow-sm"
                >
                  <p className="text-blue-darker text-lg mb-2">
                    {comment.text}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>On: {comment.postTitle || "Unknown Post"}</span>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-darker text-lg text-center">
              You haven't commented on any posts yet!
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
