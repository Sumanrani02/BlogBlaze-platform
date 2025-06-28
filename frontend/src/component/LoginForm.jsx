import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";

// --- Inline SVG for Eye Open icon ---
const EyeOpenIcon = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// --- Inline SVG for Eye Closed icon ---
const EyeClosedIcon = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.06 18.06 0 0 1 4.31-5.18M2 2l20 20M12 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
  </svg>
);

const LoginForm = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);

  const passwordHandler = () => {
    setShowPassword((prev) => !prev);
  };

   const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Logged In Successfully!");
      onLoginSuccess(resultAction.payload); 
    } else {
      toast.error(resultAction.payload || "Login failed");
    }
  };

  


  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full mt-2"
      >
        {/* Email Address */}
        <label className="w-full">
          <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
            Email Address <sup className="text-red-300">*</sup>
          </p>
          <input
            required
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
          />
        </label>

        {/* Password */}
        <label className="w-full relative mt-4">
          <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
            Password <sup className="text-red-300">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter password"
            className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
          />
          <span
            onClick={passwordHandler}
            className="absolute right-3 top-[38px] cursor-pointer text-pink-light"
          >
            {!showPassword ? (
              <EyeOpenIcon className="h-6 w-6" />
            ) : (
              <EyeClosedIcon className="h-6 w-6" />
            )}
          </span>
          <Link
            to="/forgot-password"
            className="text-base max-w-max ml-auto text-blue-lighter mt-1 hover:underline"
          >
            Forgot Password
          </Link>
        </label>

        {/* Sign In Button */}
        <button className="bg-offwhite text-green-base rounded-md font-semibold px-[12px] py-[10px] mt-4 hover:bg-opacity-90 transition-all duration-200 shadow-md">
          Sign In
        </button>
      </form>

      {/* Already have an account option */}
      <div className="mt-6 text-sm text-center text-offwhite">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-lighter hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
