// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import {
//   Mail,
//   Calendar,
//   Edit,
//   Save,
//   XCircle,
//   KeyRound,
//   Trash,
// } from "lucide-react";

// import Spinner from "../component/common/Spinner";
// import Navbar from "../layout/Navbar";
// import Footer from "../layout/Footer";
// import ConfirmationModal from "../component/common/ConfirmationModal";

// const ProfilePage = () => {
//   const {
//     isAuthenticated,
//     loading: authLoading,
//     error: authError,
//   } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [userProfile, setUserProfile] = useState(null);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [pageError, setPageError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUsername, setEditedUsername] = useState("");
//   const [editedEmail, setEditedEmail] = useState("");
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const BASE_URL = "http://localhost:5000";

//   useEffect(() => {
//     if (authLoading) return setPageLoading(true);
//     if (!isAuthenticated) {
//       toast.error("You must be logged in to view your profile.");
//       return navigate("/login");
//     }

//     const fetchUserProfileData = async () => {
//       setPageLoading(true);
//       setPageError(null);
//       const token = localStorage.getItem("authToken");

//       try {
//         const userRes = await fetch(`${BASE_URL}/api/users/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!userRes.ok) {
//           throw new Error("Failed to fetch user profile data");
//         }

//         const fetchedUser = await userRes.json();
//         setUserProfile({
//           ...fetchedUser,
//           memberSince: new Date(fetchedUser.createdAt).toLocaleDateString(
//             "en-IN",
//             {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }
//           ),
//         });
//         setEditedUsername(fetchedUser.username);
//         setEditedEmail(fetchedUser.email);
//       } catch (err) {
//         console.error("Error fetching user profile data:", err);
//         setPageError(
//           err.message || "Failed to load profile. Please try again."
//         );
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     fetchUserProfileData();
//   }, [isAuthenticated, authLoading, navigate]);

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     setPageLoading(true);
//     setPageError(null);

//     try {
//       const token = localStorage.getItem("authToken");

//       const res = await fetch(`${BASE_URL}/api/users/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           username: editedUsername,
//           email: editedEmail,
//         }),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Update failed: ${errorText}`);
//       }

//       const updatedUser = await res.json();
//       setUserProfile({
//         ...updatedUser,
//         memberSince: new Date(updatedUser.createdAt).toLocaleDateString(
//           "en-IN",
//           {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           }
//         ),
//       });

//       setIsEditing(false);
//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error saving profile:", err);
//       setPageError(err.message || "Failed to save profile. Please try again.");
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     if (userProfile) {
//       setEditedUsername(userProfile.username);
//       setEditedEmail(userProfile.email);
//     }
//     setPageError(null);
//   };

//   const handleChangePasswordClick = () => {
//     navigate("/change-password");
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setIsDeleting(false);
//   };

//   const confirmDeleteUser = async () => {
//     if (!userProfile?._id) return;
//     setIsDeleting(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/users/me`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete the user.");

//       toast.success("Your account has been successfully deleted.");
//       setIsDeleteModalOpen(false);
//       setIsDeleting(false);
//       localStorage.removeItem("authToken");
//       navigate("/login");
//     } catch (err) {
//       console.error("Error during user deletion:", err);
//       toast.error("Failed to delete your account. Please try again.");
//       setIsDeleting(false);
//     }
//   };

//   if (pageLoading || authLoading || !userProfile) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
//           <Spinner className="h-16 w-16 text-blue-base" />
//           <p className="mt-4 text-xl text-blue-darker">Loading profile...</p>
//         </div>
//       </>
//     );
//   }

//   if (authError || pageError) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
//           <p className="text-red-600 text-xl font-semibold">
//             {authError || pageError}
//           </p>
//           <p className="text-blue-darker mt-2">
//             Please refresh the page or try again later.
//           </p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-offwhite font-inter">
//       <Navbar />
//       <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl">
//         <h1 className="text-5xl font-extrabold text-blue-darker mb-10 text-center leading-tight">
//           My Profile
//         </h1>
//         {/* Profile Information Section */}
//         <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 border border-pink-base">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//             {/* Avatar */}
//             <div className="flex-shrink-0">
//               <img
//                 src={
//                   userProfile.role === "admin"
//                     ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXlq_0NnSV8hKKuokYeyhIO_PG-K6APYIHA&s"
//                     : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyGhUIYBA8rPXY2lczYsz-bcc1yf5D5vRww&s"
//                 }
//                 alt={`${userProfile.username}'s avatar`}
//                 className="w-32 h-32 rounded-full object-cover border-4 border-blue-base shadow-md"
//               />
//             </div>

//             {/* User Details / Edit Form */}
//             <div className="flex-grow text-center md:text-left">
//               {!isEditing ? (
//                 // Display Mode
//                 <div className="space-y-3">
//                   <h2 className="text-3xl font-bold text-blue-base">
//                     {userProfile.username}
//                   </h2>
//                   <p className="text-blue-darker flex items-center justify-center md:justify-start text-lg">
//                     <Mail className="h-5 w-5 mr-2 text-blue-light" />{" "}
//                     {userProfile.email}
//                   </p>
//                   <p className="text-gray-600 flex items-center justify-center md:justify-start text-sm">
//                     <Calendar className="h-4 w-4 mr-2 text-blue-light" /> Member
//                     since: {userProfile.memberSince || "N/A"}
//                   </p>
//                   <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="mt-4 inline-flex items-center px-6 py-2 bg-pink-base text-blue-base font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
//                     >
//                       <Edit className="h-4 w-4 mr-2" /> Edit Profile
//                     </button>
//                     <button
//                       onClick={handleChangePasswordClick}
//                       className="mt-4 ml-3 inline-flex items-center px-6 py-2 bg-blue-light text-offwhite font-semibold rounded-full shadow-md hover:bg-blue-base transition-colors duration-300 transform hover:scale-105"
//                     >
//                       <KeyRound className="h-4 w-4 mr-2" /> Change Password
//                     </button>
//                     <button
//                       onClick={() => setIsDeleteModalOpen(true)}
//                       className="mt-4 ml-3 inline-flex items-center px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition-colors duration-300 transform hover:scale-105"
//                     >
//                       <Trash className="h-4 w-4 mr-2" /> Delete Profile
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 // Edit Mode
//                 <form onSubmit={handleSaveProfile} className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="edit-username"
//                       className="block text-blue-darker text-sm font-bold mb-1"
//                     >
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       id="edit-username"
//                       value={editedUsername}
//                       onChange={(e) => setEditedUsername(e.target.value)}
//                       className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
//                       required
//                       disabled={pageLoading} // Disable inputs during save
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor="edit-email"
//                       className="block text-blue-darker text-sm font-bold mb-1"
//                     >
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="edit-email"
//                       value={editedEmail}
//                       onChange={(e) => setEditedEmail(e.target.value)}
//                       className="w-full p-3 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light"
//                       required
//                       disabled={pageLoading}
//                     />
//                   </div>
//                   <div className="flex gap-4 mt-4 justify-center md:justify-start">
//                     <button
//                       type="submit"
//                       className="inline-flex items-center px-6 py-2 bg-blue-base text-pink-base font-semibold rounded-full shadow-md hover:bg-blue-dark transition-colors duration-300 transform hover:scale-105"
//                       disabled={pageLoading}
//                     >
//                       {pageLoading ? (
//                         <Spinner className="h-4 w-4 mr-2" />
//                       ) : (
//                         <Save className="h-4 w-4 mr-2" />
//                       )}{" "}
//                       Save Changes
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancelEdit}
//                       className="inline-flex items-center px-6 py-2 bg-pink-darker text-offwhite font-semibold rounded-full shadow-md hover:bg-pink-dark transition-colors duration-300 transform hover:scale-105"
//                       disabled={pageLoading}
//                     >
//                       <XCircle className="h-4 w-4 mr-2" /> Cancel
//                     </button>
//                   </div>
//                   {pageError && (
//                     <p className="text-red-600 text-sm mt-2 text-center md:text-left">
//                       {pageError}
//                     </p>
//                   )}
//                 </form>
//               )}
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//       <ConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onClose={handleCloseDeleteModal}
//         onConfirm={confirmDeleteUser}
//         title="Confirm Account Deletion"
//         message="Are you absolutely sure you want to delete your account? This action is irreversible and all your data, including blogs and comments, will be permanently removed."
//         confirmText="Yes, Delete My Account"
//         cancelText="No, Keep My Account"
//         isLoading={isDeleting}
//       />
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  User, // Added for a default user icon
} from "lucide-react";

import Spinner from "../component/common/Spinner";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import ConfirmationModal from "../component/common/ConfirmationModal";

const ProfilePage = () => {
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (authLoading) return setPageLoading(true);
    if (!isAuthenticated) {
      toast.error("You must be logged in to view your profile.");
      return navigate("/login");
    }

    const fetchUserProfileData = async () => {
      setPageLoading(true);
      setPageError(null);
      const token = localStorage.getItem("authToken");

      try {
        const userRes = await fetch(`${BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user profile data");
        }

        const fetchedUser = await userRes.json();
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
        setEditedUsername(fetchedUser.username);
        setEditedEmail(fetchedUser.email);
      } catch (err) {
        console.error("Error fetching user profile data:", err);
        setPageError(
          err.message || "Failed to load profile. Please try again."
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserProfileData();
  }, [isAuthenticated, authLoading, navigate]);

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
    setPageError(null);
  };

  const handleChangePasswordClick = () => {
    navigate("/change-password");
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const confirmDeleteUser = async () => {
    if (!userProfile?._id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete the user.");

      toast.success("Your account has been successfully deleted.");
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      console.error("Error during user deletion:", err);
      toast.error("Failed to delete your account. Please try again.");
      setIsDeleting(false);
    }
  };

  // Loading and Error States
  if (pageLoading || authLoading || !userProfile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 font-inter">
          <Spinner className="h-16 w-16 text-blue-base animate-spin-slow" />
          <p className="mt-4 text-2xl font-bold text-blue-darker animate-pulse">
            Summoning your profile...
          </p>
        </div>
      </>
    );
  }

  if (authError || pageError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-orange-50 font-inter p-4">
          <p className="text-red-700 text-2xl font-extrabold text-center">
            Oops! Something went wrong.
          </p>
          <p className="text-red-500 text-lg mt-3 text-center">
            {authError || pageError}
          </p>
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
            {/* Avatar - Larger and more emphasized */}
            <div className="flex-shrink-0 relative">
              {userProfile.role === "admin" ? (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXlq_0NnSV8hKKuokYeyhIO_PG-K6APYIHA&s"
                  alt={`${userProfile.username}'s avatar`}
                  className="w-40 h-40 rounded-full object-cover border-6 border-blue-base shadow-xl transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyGhUIYBA8rPXY2lczYsz-bcc1yf5D5vRww&s"
                  alt={`${userProfile.username}'s avatar`}
                  className="w-40 h-40 rounded-full object-cover border-6 border-blue-base shadow-xl transition-transform duration-300 hover:scale-105"
                />
              )}
              <div className="absolute bottom-2 right-2 bg-pink-base text-blue-darker text-xs px-3 py-1 rounded-full font-bold shadow-md uppercase">
                {userProfile.role}
              </div>
            </div>

            {/* User Details / Edit Form */}
            <div className="flex-grow text-center md:text-left">
              {!isEditing ? (
                // Display Mode
                <div className="space-y-4">
                  <h2 className="text-5xl font-extrabold text-blue-base leading-tight">
                    Hello, {userProfile.username}!
                  </h2>
                  <p className="text-blue-darker flex items-center justify-center md:justify-start text-xl font-medium">
                    <Mail className="h-6 w-6 mr-3 text-pink-darker" />{" "}
                    {userProfile.email}
                  </p>
                  <p className="text-gray-700 flex items-center justify-center md:justify-start text-base">
                    <Calendar className="h-5 w-5 mr-3 text-pink-darker" />{" "}
                    Joined on: {userProfile.memberSince || "N/A"}
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
                      disabled={pageLoading}
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
                      disabled={pageLoading}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    <button
                      type="submit"
                      className="inline-flex items-center px-8 py-3 bg-blue-base text-pink-base font-bold rounded-full shadow-lg hover:bg-blue-dark transition-all duration-300 transform hover:scale-105"
                      disabled={pageLoading}
                    >
                      {pageLoading ? (
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
                      disabled={pageLoading}
                    >
                      <XCircle className="h-5 w-5 mr-3" /> Cancel
                    </button>
                  </div>
                  {pageError && (
                    <p className="text-red-600 text-base mt-4 text-center md:text-left font-semibold">
                      {pageError}
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
          {userProfile.role === "user" && (
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
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProfilePage;
