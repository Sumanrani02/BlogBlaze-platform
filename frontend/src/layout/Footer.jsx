import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-700 text-gray-300 py-4 sm:px-6 lg:px-6">
        <div className="container mx-auto text-center text-sm  flex justify-around">
          <p>
            &copy; {new Date().getFullYear()} BlogBlaze. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span className="text-gray-500">|</span>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
