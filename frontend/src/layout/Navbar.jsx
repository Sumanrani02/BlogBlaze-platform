import React from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";
import logo from "../assets/blg2.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Get authentication state from Redux store
  const { isAuthenticated, user: reduxUser } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully!");
    setIsOpen(false);
  };

  const isAdmin = isAuthenticated && reduxUser?.role === "admin";

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
                to="/"
                className="text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium rounded-md px-3 py-2"
              >
                Home
              </Link>
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
                to="/profile-page"
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
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-pink-darker text-offwhite font-bold rounded-full shadow-lg hover:bg-pink-dark transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Log Out
            </button>
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
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-pink-base hover:text-pink-light transition-colors duration-200 text-lg font-medium w-full px-4 py-2 rounded-md"
              >
                Home
              </Link>
            )}
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
