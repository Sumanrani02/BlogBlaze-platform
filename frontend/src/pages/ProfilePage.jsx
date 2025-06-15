import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  XCircle,
  BookOpen,
} from "lucide-react";
import Spinner from "../component/common/Spinner";
import NavBar from "../layout/Navbar";
import BlogPostCard from "../blog/BlogPostCard";
import Footer from "../layout/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axios.get("http://localhost:5000/api/user"); // Replace with your API endpoint
        const postsResponse = await axios.get(
          "http://localhost:5000/api/posts/authored"
        ); // Replace with your API endpoint
        setUser(userResponse.data);
        setAuthoredPosts(postsResponse.data);
        setEditedUsername(userResponse.data.username);
        setEditedPassword(userResponse.data.password);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Handle saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log("Saving profile:", {
        username: editedUsername,
        password: editedPassword,
      });
      await axios.put("http://localhost:5000/api/user", {
        // Replace with your API endpoint
        username: editedUsername,
        password: editedPassword,
      });

      setUser((prevUser) => ({
        ...prevUser,
        username: editedUsername,
        password: editedPassword,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error("Error saving profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditedUsername(user.username);
      setEditedPassword(user.password);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="animate-spin h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">Loading profile...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-red-600 text-xl font-semibold">{error}</p>
          <p className="text-blue-darker mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <p className="text-blue-darker text-xl font-semibold">
            User profile not found. Please log in.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <NavBar />

      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Profile Information Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-pink-base">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-base shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/150x150/blue-dark/pink-light?text=User";
                }}
              />
            </div>

            {/* User Details / Edit Form */}
            <div className="flex-grow text-center md:text-left">
              {!isEditing ? (
                // Display Mode
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-blue-base">
                    {user.username}
                  </h2>
                  <p className="text-blue-darker flex items-center justify-center md:justify-start text-lg">
                    <Mail className="h-5 w-5 mr-2 text-blue-light" />{" "}
                    {user.email}
                  </p>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-light" /> Member
                    since: {user.memberSince}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center px-6 py-2 bg-pink-base text-blue-base font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
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
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-password"
                      className="block text-blue-darker text-sm font-bold mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="edit-password"
                      value={editedPassword}
                      placeholder="change-password"
                      onChange={(e) => setEditedPassword(e.target.value)}
                      className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
                      required
                    />
                  </div>

                  <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2 bg-blue-base text-pink-base font-semibold rounded-full shadow-md hover:bg-blue-dark transition-colors duration-300 transform hover:scale-105"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}{" "}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-6 py-2 bg-pink-darker text-offwhite font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
                      disabled={loading}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm mt-2 text-center md:text-left">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Authored Posts Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-pink-base">
          <h2 className="text-4xl font-extrabold text-blue-darker mb-8 text-center flex items-center justify-center">
            <BookOpen className="h-9 w-9 mr-3 text-green-base" /> My Blog Posts
          </h2>
          {authoredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {authoredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-blue-darker">
              <p className="text-2xl font-semibold mb-4">
                You haven't published any posts yet!
              </p>
              <p className="text-lg">
                Why not{" "}
                <a
                  href="/create-blog"
                  className="text-blue-base hover:underline font-medium"
                >
                  create your first blog post
                </a>
                ?
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
