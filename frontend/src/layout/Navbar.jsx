import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";
import logo from "../assets/blg2.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { isAuthenticated, user: reduxUser } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const profileDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully!");
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const isAdmin = isAuthenticated && reduxUser?.role === "admin";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-blue-base p-4 shadow-md w-full font-inter">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          to="/"
          className="text-pink-base text-3xl font-extrabold tracking-tight"
        >
          <img src={logo} alt="BlogBlaze Logo" className="h-8 md:h-10" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {!isAdmin && (
            <>
              <Link
                to="/posts"
                className="text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium rounded-md px-3 py-2"
              >
                Blog
              </Link>
            </>
          )}
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                to="/create-blog"
                className="text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium rounded-md px-3 py-2"
              >
                Write for Us
              </Link>
           
              <Link
                to="/dashboard"
                className="text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium rounded-md px-3 py-2"
              >
                Dashboard
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin-dashboard"
              className="text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium rounded-md px-3 py-2"
            >
              Admin Dashboard
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button className="px-5 py-2 bg-pink-base text-blue-base font-bold rounded-full shadow-lg hover:bg-pink-light hover:text-blue-dark transition-all duration-300 transform hover:scale-105 text-lg">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 bg-blue-light text-offwhite font-bold rounded-full shadow-lg hover:bg-blue-lighter hover:text-blue-dark transition-all duration-300 transform hover:scale-105 text-lg">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-base text-blue-base font-bold text-lg cursor-pointer shadow-lg hover:bg-pink-light transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-light"
                title="Profile"
              >
                {reduxUser?.role === "user" ? (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSyGhUIYBA8rPXY2lczYsz-bcc1yf5D5vRww&s"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXlq_0NnSV8hKKuokYeyhIO_PG-K6APYIHA&s"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-pink-light">
                  <Link
                    to="/profile-page"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-blue-darker hover:bg-blue-light hover:text-white transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-blue-darker hover:bg-blue-light hover:text-white transition-colors duration-200"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-pink-base hover:text-pink-light focus:outline-none focus:ring-2 focus:ring-pink-light rounded-md p-2"
          >
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-blue-dark py-4 px-4 shadow-lg animate-slideInDown">
          <div className="flex flex-col items-start space-y-4">
            {!isAdmin && (
              <Link
                to="/posts"
                onClick={() => setIsOpen(false)}
                className="block text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium w-full px-4 py-2 rounded-md"
              >
                Blog
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/create-blog"
                  onClick={() => setIsOpen(false)}
                  className="block text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium w-full px-4 py-2 rounded-md"
                >
                  Write for Us
                </Link>
                <Link
                  to="/profile-page"
                  onClick={() => setIsOpen(false)}
                  className="block text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium w-full px-4 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              </>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin-dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium w-full px-4 py-2 rounded-md"
              >
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-2 bg-pink-base text-blue-base font-bold rounded-full shadow-lg hover:bg-pink-light hover:text-blue-dark transition-all duration-300 transform hover:scale-105 text-lg w-full text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-2 bg-blue-light text-offwhite font-bold rounded-full shadow-lg hover:bg-blue-lighter hover:text-blue-dark transition-all duration-300 transform hover:scale-105 text-lg w-full text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block px-5 py-2 bg-pink-darker text-offwhite font-bold rounded-full shadow-lg hover:bg-pink-dark transition-all duration-300 transform hover:scale-105 text-lg w-full text-center"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
