import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import logo from "@/assets/quickbuylogo.svg";
import GlobalSearch from "../UI/GlobalSearch";

const Navbar = ({ user, logout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
      <nav className="w-full bg-(--color-dark-gray) text-white flex items-center justify-between px-6 md:px-10 h-20 fixed top-0 left-0 z-50 shadow-md">

        {/* Logo */}
        <Link to="/dashboard">
          <img src={logo} alt="Admin Logo" className="w-32 md:w-36" />
        </Link>

        <div className="flex items-center gap-5">

          {/* User menu (always present) */}
          <div className="relative flex items-center">
            <GlobalSearch/>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <FaUserCircle size={28} />
              <span className="font-semibold hidden md:flex">{user?.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow-lg w-44 py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
