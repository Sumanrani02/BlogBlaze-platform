// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";
// import { changePassword, resetPasswordStatus } from "../../redux/profileSlice";
// import Spinner from "../common/Spinner";
// import Navbar from "../../layout/Navbar";
// import Footer from "../../layout/Footer";

// const ChangePassword = () => {
//   const {
//     isAuthenticated,
//     user: reduxUser,
//     loading: authLoading,
//   } = useSelector((state) => state.auth);
//   const { isPasswordChanged } = useSelector((state) => state.profile);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }
//     if (!isAuthenticated) {
//       toast.error("You must be logged in to change your password.");
//       navigate("/login");
//     }
//   }, [isAuthenticated, authLoading, navigate]);

//   useEffect(() => {
//     if (isPasswordChanged) {
//       toast.success("Password changed successfully!");
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmNewPassword("");

//       setTimeout(() => {
//         dispatch(resetPasswordStatus());
//         navigate("/profile-page");
//       }, 3000);
//     }
//   }, [isPasswordChanged, dispatch, navigate]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError(null);
//   //   setSuccessMessage(null);

//   //   if (!currentPassword || !newPassword || !confirmNewPassword) {
//   //     setError("All fields are required.");
//   //     setLoading(false);
//   //     return;
//   //   }
//   //   if (newPassword.length < 6) {
//   //     setError("New password must be at least 6 characters long.");
//   //     setLoading(false);
//   //     return;
//   //   }
//   //   if (newPassword !== confirmNewPassword) {
//   //     setError("New passwords do not match!");
//   //     setLoading(false);
//   //     return;
//   //   }
//   //   if (currentPassword === newPassword) {
//   //     setError("New password cannot be the same as the current password.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.put(
//   //       "http://localhost:5000/api/users/change-password",
//   //       { currentPassword, newPassword },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//   //         },
//   //       }
//   //     );

//   //     setSuccessMessage(response.data.message);
//   //     toast.success(response.data.message);
//   //     setCurrentPassword("");
//   //     setNewPassword("");
//   //     setConfirmNewPassword("");

//   //     setTimeout(() => {
//   //       if (reduxUser?.role === "admin") {
//   //         navigate("/admin-dashboard");
//   //       } else {
//   //         navigate("/profile-page");
//   //       }
//   //     }, 3000);
//   //   } catch (err) {
//   //     console.error("Change password error:", err);
//   //     setError(
//   //       err.response?.data?.message ||
//   //         "Failed to change password. Please try again."
//   //     );
//   //     toast.error(err.response?.data?.message || "Failed to change password.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       toast.error("All fields are required.");
//       return;
//     }
//     if (newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters long.");
//       return;
//     }
//     if (newPassword !== confirmNewPassword) {
//       toast.error("New passwords do not match!");
//       return;
//     }
//     if (currentPassword === newPassword) {
//       toast.error("New password cannot be the same as the current password.");
//       return;
//     }
//     console.log("Sending data:", { currentPassword, newPassword });
//     dispatch(changePassword({ currentPassword, newPassword }));
//   };

//   if (authLoading || !isAuthenticated) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
//           <Spinner className="h-16 w-16 text-blue-base" />
//           <p className="mt-4 text-xl text-blue-darker">
//             Checking authentication...
//           </p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-offwhite font-inter">
//       <Navbar />
//       <main className="flex-grow flex items-center justify-center px-4 py-12">
//         <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
//           <h1 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
//             Change Password
//           </h1>
//           <p className="text-blue-darker text-center mb-8">
//             Enter your current and new password below.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Current Password Input */}
//             <div>
//               <label
//                 htmlFor="current-password"
//                 className="block text-blue-darker text-lg font-bold mb-2"
//               >
//                 Current Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-blue-light" />
//                 </div>
//                 <input
//                   type={showCurrentPassword ? "text" : "password"}
//                   id="current-password"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   placeholder="Enter current password"
//                   className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                   required
//                   disabled={loading}
//                 />
//                 <span
//                   onClick={() => setShowCurrentPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
//                 >
//                   {showCurrentPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* New Password Input */}
//             <div>
//               <label
//                 htmlFor="new-password"
//                 className="block text-blue-darker text-lg font-bold mb-2"
//               >
//                 New Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-blue-light" />
//                 </div>
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   id="new-password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="Enter new password (min 6 chars)"
//                   className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                   required
//                   disabled={loading}
//                 />
//                 <span
//                   onClick={() => setShowNewPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
//                 >
//                   {showNewPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* Confirm New Password Input */}
//             <div>
//               <label
//                 htmlFor="confirm-new-password"
//                 className="block text-blue-darker text-lg font-bold mb-2"
//               >
//                 Confirm New Password <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-blue-light" />
//                 </div>
//                 <input
//                   type={showConfirmNewPassword ? "text" : "password"}
//                   id="confirm-new-password"
//                   value={confirmNewPassword}
//                   onChange={(e) => setConfirmNewPassword(e.target.value)}
//                   placeholder="Confirm new password"
//                   className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                   required
//                   disabled={loading}
//                 />
//                 <span
//                   onClick={() => setShowConfirmNewPassword((prev) => !prev)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
//                 >
//                   {showConfirmNewPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </span>
//               </div>
//             </div>

//             {/* Error and Success Messages */}
//             {error && (
//               <div
//                 className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//                 role="alert"
//               >
//                 <strong className="font-bold">Error!</strong>
//                 <span className="block sm:inline ml-2">{error}</span>
//               </div>
//             )}
//             {successMessage && (
//               <div
//                 className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
//                 role="alert"
//               >
//                 <CheckCircle className="inline-block h-5 w-5 mr-2" />
//                 <strong className="font-bold">Success!</strong>
//                 <span className="block sm:inline ml-2">{successMessage}</span>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Spinner className="h-6 w-6 text-blue-base" />
//               ) : (
//                 <>Change Password</>
//               )}
//             </button>
//           </form>

//           {/* Back to Profile Link */}
//           <div className="mt-8 text-center">
//             <Link
//               to={
//                 reduxUser?.role === "admin"
//                   ? "/admin-dashboard"
//                   : "/profile-page"
//               }
//               className="inline-flex items-center text-blue-base hover:underline font-medium text-lg"
//             >
//               <ArrowLeft className="h-5 w-5 mr-2" /> Back to Profile
//             </Link>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ChangePassword;






import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword, resetPasswordStatus } from "../../redux/profileSlice";
import Spinner from "../common/Spinner";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { isAuthenticated, user: reduxUser, loading: authLoading } = useSelector((state) => state.auth);
  const { isPasswordChanged, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);

  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in to change your password.");
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  
  useEffect(() => {
    if (isPasswordChanged) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      const timer = setTimeout(() => {
        dispatch(resetPasswordStatus()); 
        navigate("/profile-page");
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isPasswordChanged, dispatch, navigate, reduxUser]);

 
  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
    }
  }, [profileError]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }

    dispatch(changePassword({ currentPassword, newPassword }));
  };

  if (authLoading || !isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col justify-center items-center bg-offwhite font-inter">
          <Spinner className="h-16 w-16 text-blue-base" />
          <p className="mt-4 text-xl text-blue-darker">
            Checking authentication...
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite font-inter">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
          <h1 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
            Change Password
          </h1>
          <p className="text-blue-darker text-center mb-8">
            Enter your current and new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password Input */}
            <div>
              <label
                htmlFor="current-password"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-light" />
                </div>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                  required
                  disabled={profileLoading}
                />
                <span
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* New Password Input */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-light" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                  required
                  disabled={profileLoading}
                />
                <span
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm New Password Input */}
            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-blue-darker text-lg font-bold mb-2"
              >
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-light" />
                </div>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  id="confirm-new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                  required
                  disabled={profileLoading}
                />
                <span
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={profileLoading} 
            >
              {profileLoading ? (
                <Spinner className="h-6 w-6 text-blue-base" />
              ) : (
                <>Change Password</>
              )}
            </button>
          </form>

          {/* Back to Profile Link */}
          <div className="mt-8 text-center">
            <Link
              to={
              "/profile-page"
              }
              className="inline-flex items-center text-blue-base hover:underline font-medium text-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChangePassword;