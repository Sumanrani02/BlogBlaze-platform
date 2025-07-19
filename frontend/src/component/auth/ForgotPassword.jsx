// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { Mail, ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import Spinner from "../common/Spinner";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     if (!email) {
//       setError("Please enter your email address.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/forgot-password",
//         { email }
//       );
//       setSuccessMessage(response.data.message);
//       toast.success(response.data.message);
//     } catch (err) {
//       console.error("Forgot password error:", err);
//       setError(
//         err.response?.data?.message ||
//           "Failed to send reset link. Please try again."
//       );
//       toast.error(err.response?.data?.message || "Failed to send reset link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-offwhite font-inter px-4">
//       <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
//         <h2 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
//           Forgot Password
//         </h2>
//         <p className="text-blue-darker text-center mb-8">
//           Enter your email address below and we'll send you a link to reset your
//           password.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email Input */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-blue-darker text-lg font-bold mb-2"
//             >
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-blue-light" />
//               </div>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
//                 required
//                 disabled={loading}
//               />
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
//               <strong className="font-bold">Success!</strong>
//               <span className="block sm:inline ml-2">{successMessage}</span>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner className="h-6 w-6 text-blue-base" />
//             ) : (
//               <>Send Reset Link</>
//             )}
//           </button>
//         </form>

//         {/* Back to Login Link */}
//         <div className="mt-8 text-center">
//           <Link
//             to="/login"
//             className="inline-flex items-center text-blue-base hover:underline font-medium text-lg"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" /> Back to Log In
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";
import { forgotPassword} from "../../redux/profileSlice";
const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const { loading, error } = useSelector((state) => state.profile);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite font-inter px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md border border-blue-light">
        <h2 className="text-4xl font-extrabold text-blue-darker text-center mb-6">
          Forgot Password
        </h2>
        <p className="text-blue-darker text-center mb-8">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-blue-darker text-lg font-bold mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-light" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 pl-10 rounded-md border border-pink-darker bg-offwhite text-blue-darker focus:outline-none focus:ring-2 focus:ring-blue-light shadow-sm"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <Spinner className="h-6 w-6 text-blue-base" />
            ) : (
              <>Send Reset Link</>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-base hover:underline font-medium text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;