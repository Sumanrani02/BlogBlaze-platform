import React from "react";
import LoginForm from "./LoginForm";
import frameImage from "../assets/frame.png";
import SignUpForm from "./SignUpForm";


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
