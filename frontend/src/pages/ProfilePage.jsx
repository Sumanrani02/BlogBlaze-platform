import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Calendar,
  Edit,
  Save,
  XCircle,
  KeyRound,
  Trash,
  User, 
} from "lucide-react";

import {
  fetchUserProfile,
  updateUserProfile,
  deleteAccount,
  clearProfileError,
} from "../redux/profileSlice";
import Spinner from "../component/common/Spinner";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import ConfirmationModal from "../component/common/ConfirmationModal";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);
  const {
    userProfile,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [formattedProfile, setFormattedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your profile.");
      return navigate("/login");
    }
    dispatch(fetchUserProfile());
  }, [isAuthenticated, authLoading, navigate, dispatch]);

  useEffect(() => {
    if (userProfile) {
      const formatted = {
        ...userProfile,
        memberSince: new Date(userProfile.createdAt).toLocaleDateString(
          "en-IN",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
      };
      setFormattedProfile(formatted);
      setEditedUsername(userProfile.username);
      setEditedEmail(userProfile.email);
    }
  }, [userProfile]);

  useEffect(() => {
    return () => {
      dispatch(clearProfileError());
    };
  }, [dispatch]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(updateUserProfile({
      username: editedUsername,
      email: editedEmail,
    }));
    
    if (updateUserProfile.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (formattedProfile) {
      setEditedUsername(userProfile.username);
      setEditedEmail(userProfile.email);
    }
    dispatch(clearProfileError());
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteUser = async () => {
    if (!formattedProfile?._id) return;
    
    const result = await dispatch(deleteAccount());
    
    if (deleteAccount.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  // Loading and Error States
  if (profileLoading || authLoading || !formattedProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-light via-offwhite to-pink-light flex items-center justify-center">
          <Spinner className="h-16 w-16 text-blue-base" />
        </div>
        <Footer />
      </>
    );
  }

  if (authError || profileError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-light via-offwhite to-pink-light flex flex-col items-center justify-center px-4">
          <p className="text-blue-darker text-3xl font-bold text-center">
            Oops! Something went wrong.
          </p>
          <p className="text-red-500 text-lg mt-3 text-center">
            {authError || profileError}
          </p>
          <p className="text-gray-600 mt-5 text-center">
            Please refresh the page or try again later. If the problem persists,
            contact support.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center px-6 py-3 bg-blue-base text-pink-base font-bold rounded-full shadow-lg hover:bg-blue-dark transition-all duration-300 transform hover:scale-105"
          >
            Go Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter relative overflow-hidden">
      <div className="absolute  bottom-0 left-1/4 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute  bottom-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>

      <Navbar />

      <main className="flex-grow container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-6xl z-10 relative">
        <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-10 border border-pink-base transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-blue-50/50 opacity-40 rounded-3xl"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="flex-shrink-0 relative">
              {formattedProfile.role === "admin" ? (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXlq_0NnSV8hKKuokYeyhIO_PG-K6APYIHA&s"
                  alt={`${formattedProfile.username}'s avatar`}
                  className="w-40 h-40 rounded-full object-cover border-6 border-blue-base shadow-xl transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyGhUIYBA8rPXY2lczYsz-bcc1yf5D5vRww&s"
                  alt={`${formattedProfile.username}'s avatar`}
                  className="w-40 h-40 rounded-full object-cover border-6 border-blue-base shadow-xl transition-transform duration-300 hover:scale-105"
                />
              )}
              <div className="absolute bottom-2 right-2 bg-pink-base text-blue-darker text-xs px-3 py-1 rounded-full font-bold shadow-md uppercase">
                {formattedProfile.role}
              </div>
            </div>

            {/* User Details / Edit Form */}
            <div className="flex-grow text-center md:text-left">
              {!isEditing ? (
                <div className="space-y-4">
                  <h2 className="text-5xl font-extrabold text-blue-base leading-tight">
                    Hello, {formattedProfile.username}!
                  </h2>
                  <p className="text-blue-darker flex items-center justify-center md:justify-start text-xl font-medium">
                    <Mail className="h-6 w-6 mr-3 text-pink-darker" />{" "}
                    {formattedProfile.email}
                  </p>
                  <p className="text-gray-700 flex items-center justify-center md:justify-start text-base">
                    <Calendar className="h-5 w-5 mr-3 text-pink-darker" />{" "}
                    Joined on: {formattedProfile.memberSince || "N/A"}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-8 py-3 bg-pink-base text-blue-base font-bold rounded-full shadow-lg hover:bg-pink-dark hover:text-white transition-all duration-300 transform hover:scale-105 group"
                    >
                      <Edit className="h-5 w-5 mr-3 group-hover:rotate-6 transition-transform duration-300" />{" "}
                      Edit Profile
                    </button>
                    <button
                      onClick={handleChangePasswordClick}
                      className="inline-flex items-center px-8 py-3 bg-blue-light text-offwhite font-bold rounded-full shadow-lg hover:bg-blue-base transition-all duration-300 transform hover:scale-105 group"
                    >
                      <KeyRound className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />{" "}
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label
                      htmlFor="edit-username"
                      className="block text-blue-darker text-lg font-bold mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="edit-username"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-4 focus:ring-blue-light focus:border-transparent transition-all duration-300 text-lg"
                      required
                      disabled={profileLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-email"
                      className="block text-blue-darker text-lg font-bold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-4 focus:ring-blue-light focus:border-transparent transition-all duration-300 text-lg"
                      required
                      disabled={profileLoading}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <button
                      type="submit"
                      className="inline-flex items-center px-8 py-3 bg-blue-base text-pink-base font-bold rounded-full shadow-lg hover:bg-blue-dark transition-all duration-300 transform hover:scale-105"
                      disabled={profileLoading}
                    >
                      {profileLoading ? (
                        <Spinner className="h-5 w-5 mr-3" />
                      ) : (
                        <Save className="h-5 w-5 mr-3" />
                      )}{" "}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-8 py-3 bg-pink-darker text-offwhite font-bold rounded-full shadow-lg hover:bg-pink-dark transition-all duration-300 transform hover:scale-105"
                      disabled={profileLoading}
                    >
                      <XCircle className="h-5 w-5 mr-3" /> Cancel
                    </button>
                  </div>
                  {profileError && (
                    <p className="text-red-600 text-base mt-4 text-center md:text-left font-semibold">
                      {profileError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <User className="h-16 w-16 text-blue-base mb-4" />
            <h3 className="text-2xl font-bold text-blue-darker mb-2">
              Recent Activity
            </h3>
            <p className="text-gray-700">
              Check out your latest interactions, comments, and blog posts.
            </p>
            <Link
              to={"/dashboard"}
              className="mt-5 px-6 py-2 bg-pink-base text-blue-base font-semibold rounded-full hover:bg-pink-dark hover:text-white transition-colors duration-300"
            >
              View Activity
            </Link>
          </div>

          {/* Card 2: Your Blogs */}
          {formattedProfile.role === "user" && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
              <Edit className="h-16 w-16 text-pink-base mb-4" />
              <h3 className="text-2xl font-bold text-blue-darker mb-2">
                Create Blogs
              </h3>
              <p className="text-gray-700">
                Manage and create new blog entries, share your thoughts!
              </p>
              <Link
                to={"/create-blog"}
                className="mt-5 px-6 py-2 bg-blue-light text-offwhite font-semibold rounded-full hover:bg-blue-base transition-colors duration-300"
              >
                Create Your Blog
              </Link>
            </div>
          )}

          {/* Card 3: Settings & Preferences */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
            <Trash className="h-16 w-16 text-blue-base mb-4" />
            <h3 className="text-2xl font-bold text-blue-darker mb-2">
              Delete Account
            </h3>
            <p className="text-gray-700">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="mt-5 px-6 py-2 bg-pink-base text-blue-base font-semibold rounded-full hover:bg-pink-dark hover:text-white transition-colors duration-300"
            >
              Delete Profile
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDeleteUser}
        title="Confirm Account Deletion"
        message="Are you absolutely sure you want to delete your account? This action is irreversible and all your data, including blogs and comments, will be permanently removed. This cannot be undone!"
        confirmText="Yes, Permanently Delete My Account"
        cancelText="No, Keep My Account"
        isLoading={profileLoading}
      />
    </div>
  );
};

export default ProfilePage;