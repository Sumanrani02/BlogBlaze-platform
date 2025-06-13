import React from "react";
import toast from "react-hot-toast";
import logo from "../assets/blg2.svg";
import { Link } from "react-router-dom";


const NavBar = ({ IsLogged, setIsLogged }) => {
  return (
    <div className="w-full bg-blue-base">
    <div className=" flex bg-blue-base  items-center justify-evenly w-11/12 mx-auto py-4 max-w-[1160px] ">
      <Link to={"/"}>
    
        <img src={logo} alt="blg" className="mt-2" width={150} />
      </Link>

      <ul className=" text-white text-xl flex gap-x-6">
        <Link to={"/"}>
          <li>Home</li>
        </Link>

        <Link to={"/blog"}>
          <li>Blog</li>
        </Link>

        <Link to={"/write"}>
          <li>Write for Us</li>
        </Link>
      </ul>

      <div className=" flex gap-x-4 items-center">
        {!IsLogged && (
          <Link to={"/login"}>
            <button className="bg-blue-dark  text-white py-[8px] px-[12px] rounded-[8px] border">
              Log In
            </button>
          </Link>
        )}

        {!IsLogged && (
          <Link to={"/signup"}>
            <button className="bg-blue-dark  text-white py-[8px] px-[12px] rounded-[8px] border">
              Sign In
            </button>
          </Link>
        )}

        {IsLogged && (
          <Link to={"/"}>
            <button
              onClick={() => {
                setIsLogged(false);
                toast.success("logged Out");
              }}
              className="bg-blue-dark text-white py-[8px] px-[12px] rounded-[8px] border"
            >
              Log out
            </button>
          </Link>
        )}

        {IsLogged && (
          <Link to={"/dashboard"}>
            <button className="bg-blue-dark  text-white py-[8px] px-[12px] rounded-[8px] border">
              Dashboard
            </button>
          </Link>
        )}
      </div>
    </div>
    </div>
  );
};

export default NavBar;
