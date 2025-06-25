import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/authSlice";

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

const SignUpForm = ({ onSignUpSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    React.useState(false);

  const passwordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  const confirmpasswordHandler = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (data) => {
      const { firstName, lastName, confirmPassword, ...rest } = data;
  
  // Use username from form or construct from first/last name
  const registerData = {
    username: `${firstName} ${lastName}`,  // or `${firstName} ${lastName}`
    email: rest.email,
    password: rest.password,
  };
    const resultAction = await dispatch(registerUser(registerData));
    console.log("🔍 Registering with:", registerData);

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload || "Account Created Successfully!");
      onSignUpSuccess();
    } else {
      toast.error(resultAction.payload || "Sign Up failed. Please try again.");
    }
  };

  const password = watch("password");

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full mt-2"
      >
        {/* First Name & Last Name */}
        <div className="flex gap-x-4">
          <label className="w-full">
            <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
              First Name <sup className="text-red-300">*</sup>
            </p>
            <input
              required
              type="text"
              {...register("firstName")}
              placeholder="Enter first name"
              className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
            />
          </label>
          <label className="w-full">
            <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
              Last Name <sup className="text-red-300">*</sup>
            </p>
            <input
              required
              type="text"
              {...register("lastName")}
              placeholder="Enter last name"
              className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
            />
          </label>
        </div>
        {/* Username Field */}
        <label className="w-full mt-4">
          <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
            Username <sup className="text-red-300">*</sup>
          </p>
          <input
            required
            type="text"
            {...register("username")}
            placeholder="Enter username"
            className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
          />
        </label>

        {/* Email Address */}
        <label className="w-full mt-4">
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

        {/* Create Password & Confirm Password */}
        <div className="flex gap-x-4 mt-4">
          <label className="w-full relative">
            <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
              Create Password <sup className="text-red-300">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Create password"
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </label>

          <label className="w-full relative">
            <p className="text-[0.875rem] text-offwhite mb-1 leading-[1.375rem]">
              Confirm Password <sup className="text-red-300">*</sup>
            </p>
            <input
              required
              type={confirmPasswordVisible ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match!!!",
              })}
              placeholder="Confirm password"
              className="bg-blue-base rounded-md text-offwhite w-full p-[12px] placeholder:text-pink-light focus:outline-none focus:ring-2 focus:ring-offwhite"
            />
            <span
              onClick={confirmpasswordHandler}
              className="absolute right-3 top-[38px] cursor-pointer text-pink-light"
            >
              {!confirmPasswordVisible ? (
                <EyeOpenIcon className="h-6 w-6" />
              ) : (
                <EyeClosedIcon className="h-6 w-6" />
              )}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-900 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>
        </div>

        {/* Create Account Button */}
        <button className="bg-offwhite text-green-base rounded-md font-semibold px-[12px] py-[10px] mt-8 hover:bg-opacity-90 transition-all duration-200 shadow-md">
          Create Account
        </button>
      </form>

      {/* Already have an account option */}
      <div className="mt-6 text-sm text-center text-offwhite">
        Already have an account?{" "}
        <Link to="/login" className=" text-blue-lighter hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
