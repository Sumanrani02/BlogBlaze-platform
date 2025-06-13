import React, { useState } from "react";
import { User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

const AuthForm = ({
  type = "login",
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      if (type === "register") {
        onSubmit({ username, email, password });
      } else {
        onSubmit({ email, password });
      }
    }
  };

  const formTitle = type === "login" ? "Welcome Back!" : "Join BlogBlaze!";
  const buttonText = type === "login" ? "Login" : "Sign Up";
  const switchTypeText =
    type === "login" ? "Don't have an account?" : "Already have an account?";
  const switchLinkText = type === "login" ? "Sign Up" : "Login";
  const switchLinkHref = type === "login" ? "/signup" : "/login";

  return (
    <div className="flex items-center justify-center min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-pink-base transform transition-all duration-300 hover:scale-105">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-blue-base">
            {formTitle}
          </h2>
          {error && (
            <p className="mt-4 text-center text-red-600 text-sm font-medium rounded-md bg-red-100 p-3 border border-red-300">
              {error}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {type === "register" && (
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    className="h-5 w-5 text-blue-light"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-md relative block w-full px-10 py-3 border border-pink-darker placeholder-pink-dark text-blue-darker focus:outline-none focus:ring-blue-light focus:border-blue-light focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-light" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-pink-darker placeholder-pink-dark text-blue-darker focus:outline-none focus:ring-blue-light focus:border-blue-light focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-light" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-10 py-3 border border-pink-darker placeholder-pink-dark text-blue-darker focus:outline-none focus:ring-blue-light focus:border-blue-light focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {type === "login" && (
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-base hover:text-blue-light"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-blue-base bg-pink-base hover:bg-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-dark transition-all duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-6 w-6 text-blue-base" />
              ) : (
                <>
                  {buttonText}{" "}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          {switchTypeText}{" "}
          <a
            href={switchLinkHref}
            className="font-medium text-blue-base hover:text-blue-light"
          >
            {switchLinkText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
