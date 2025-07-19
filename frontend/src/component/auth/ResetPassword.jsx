// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";
// import Spinner from "../common/Spinner";

// const ResetPassword = () => {
//   const {  token } = useParams();
//   const navigate = useNavigate();

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     if ( !token) {
//       setError(
//         "Invalid or missing password reset link. Please try requesting a new one."
//       );
//     }
//   }, [ token ]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     if ( !token) {
//       setError("Invalid reset link. Please request a new one.");
//       setLoading(false);
//       return;
//     }
//     if (!newPassword) {
//       setError("Please enter a new password.");
//       setLoading(false);
//       return;
//     }
//     if (newPassword.length < 6) {
//       setError("New password must be at least 6 characters long.");
//       setLoading(false);
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/auth/reset-password/${token}`,
//         {
//          password: newPassword
//         }
//       );

//       setSuccessMessage(
//         response.data.message || "Password reset successfully!"
//       );
//       toast.success(response.data.message || "Password reset successfully!");

//       // Redirect after success
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
//     } catch (err) {
//       console.error("Reset password error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to reset password. Please try again."
//       );
//       toast.error(err.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-offwhite font-inter px-4">
//       <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
//         <h2 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
//           Reset Your Password
//         </h2>
//         <p className="text-blue-darker text-center mb-8">
//           Enter your new password below.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* New Password Input */}
//           <div>
//             <label
//               htmlFor="new-password"
//               className="block text-blue-darker text-lg font-bold mb-2"
//             >
//               New Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-blue-light" />
//               </div>
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 id="new-password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Enter new password (min 6 chars)"
//                 className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                 required
//                 disabled={loading}
//               />
//               <span
//                 onClick={() => setShowNewPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
//               >
//                 {showNewPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <Eye className="h-5 w-5" />
//                 )}
//               </span>
//             </div>
//           </div>

//           {/* Confirm New Password Input */}
//           <div>
//             <label
//               htmlFor="confirm-password"
//               className="block text-blue-darker text-lg font-bold mb-2"
//             >
//               Confirm New Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-blue-light" />
//               </div>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirm-password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm new password"
//                 className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                 required
//                 disabled={loading}
//               />
//               <span
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <Eye className="h-5 w-5" />
//                 )}
//               </span>
//             </div>
//           </div>

//           {/* Error and Success Messages */}
//           {error && (
//             <div
//               className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//               role="alert"
//             >
//               <strong className="font-bold">Error!</strong>
//               <span className="block sm:inline ml-2">{error}</span>
//             </div>
//           )}
//           {successMessage && (
//             <div
//               className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
//               role="alert"
//             >
//               <CheckCircle className="inline-block h-5 w-5 mr-2" />
//               <strong className="font-bold">Success!</strong>
//               <span className="block sm:inline ml-2">{successMessage}</span>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading || !token} //
//           >
//             {loading ? (
//               <Spinner className="h-6 w-6 text-blue-base" />
//             ) : (
//               <>Reset Password</>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { resetPassword } from "../../redux/profileSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.profile);

  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSuccess = () => {
    toast.success("Password reset successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await dispatch(resetPassword({ token, newPassword })).unwrap();
      handleSuccess();
    } catch (err) {
      console.log("error is from reset-Password", err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite font-inter px-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-md text-center"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">
            Invalid or missing password reset link. Please try requesting a new
            one.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite font-inter px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
        <h2 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
          Reset Your Password
        </h2>
        <p className="text-blue-darker text-center mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={loading}
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
              htmlFor="confirm-password"
              className="block text-blue-darker text-lg font-bold mb-2"
            >
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-light" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                required
                disabled={loading}
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-light"
              >
                {showConfirmPassword ? (
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
            disabled={loading || !token}
          >
            {loading ? (
              <Spinner className="h-6 w-6 text-blue-base" />
            ) : (
              <>Reset Password</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
