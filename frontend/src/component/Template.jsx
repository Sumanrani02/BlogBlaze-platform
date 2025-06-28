import React from "react";
import LoginForm from "./LoginForm";
import frameImage from "../assets/frame.png";
import SignUpForm from "./SignUpForm";

// --- Inline SVG for Google Icon (replaces FcGoogle) ---
const GoogleIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.24 10.27v3.08h7.91c-.24 1.48-1.07 3.63-3.05 5.06-1.74 1.25-3.92 2-5.74 2-5.77 0-10.45-4.68-10.45-10.45s4.68-10.45 10.45-10.45c3.08 0 5.16 1.3 6.33 2.45l2.67-2.58c-1.72-1.58-3.9-2.58-9-2.58C5.22 0 0 5.22 0 12s5.22 12 12 12c5.77 0 9.87-4.14 9.87-9.87 0-.75-.08-1.4-.2-2.03h-9.43zm0 0"></path>
  </svg>
);

const Template = ({
  title,
  description1,
  imagePlaceholderUrl,
  formType,
  onSignUpSuccess,
  onLoginSuccess
}) => {
  const frameImagePlaceholderUrl = frameImage;
  const handleGoogleLogin = () => {
  window.open("http://localhost:5000/api/auth/google", "_self");
};

  return (
    <div className="flex flex-col items-center w-11/12 max-w-[1160px] py-8 mx-auto">
      {/* Title and Description Section */}
      <div className="text-center mb-8">
        <h1 className="text-offwhite font-semibold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>
        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-offwhite">{description1}</span>
        </p>
      </div>

      {/* Form and Image Section */}
      <div className="flex flex-col md:flex-row justify-around w-full gap-x-12 items-center">
        {/* Left Section: Form */}
        <div className="w-11/12 max-w-[450px]">
          {/* Conditionally render SignUpForm or LoginForm, passing success callbacks */}
          {formType === "signup" ? (
            <SignUpForm onSignUpSuccess={onSignUpSuccess} />
          ) : (
            <LoginForm onLoginSuccess={onLoginSuccess} />
          )}

          {/* 'Or' Divider */}
          <div className="w-full flex items-center my-4 gap-x-2">
            <div className="w-full h-[1px] bg-[#6B8E8E]"></div>
            <p className="text-[#6B8E8E] font-medium leading-[1.375rem]">or</p>
            <div className="w-full h-[1px] bg-[#6B8E8E]"></div>
          </div>

          {/* Google Sign Up Button */}
          <button onClick={handleGoogleLogin} className="w-full flex justify-center items-center rounded-[8px] font-medium text-green-base border border-[#6B8E8E] px-[12px] py-[8px] gap-x-2 mt-6 bg-offwhite hover:bg-opacity-90 transition-all duration-200 shadow-sm">
            <GoogleIcon />
            Sign Up with Google
          </button>
        </div>

        {/* Right Section: Images */}
        <div className="w-11/12 max-w-[450px] relative mt-8 md:mt-0">
          <img src={frameImagePlaceholderUrl} alt="frame" width={558} height={504} />
          <img
            src={imagePlaceholderUrl}
            alt="student"
            width={558}
            height={504}
            className="absolute -top-4 right-4 shadow-lg rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Template;
