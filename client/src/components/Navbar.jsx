import React, { useState } from "react";
import logo from "@/assets/quickbuylogo.svg";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ page, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkBase = "text-lg font-semibold transition-all duration-300";
  const activeColor = "text-(--color-green)";
  const inactiveColor = "text-white hover:text-(--color-green)";

  const links = [
    { name: "Home", to: "/", key: "home" },
    { name: "Shop", to: "/products", key: "products" },
    { name: "About", to: "/about", key: "about" },
  ];

  return (
    <nav className="w-full bg-(--color-dark-gray) flex items-center justify-between px-6 md:px-10 h-20 relative">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="QuickBuy Logo" className="w-36 md:w-40" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={`${linkBase} ${
              page === link.key ? activeColor : inactiveColor
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex gap-6 items-center">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-(--color-light-gray) border qb-border"
            >
              Login
            </Link>
            <Link to="/cart" className="px-4 py-2 rounded-md bg-(--color-green)">
              Cart
            </Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-white flex items-center gap-2 cursor-pointer"
            >
              <FaUserCircle size={28} />
              <span className="font-semibold">{user.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 bg-white rounded-lg shadow-lg w-44 py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Cart
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
        )}
      </div>

      {/* Mobile Right Side */}
      {!user ? (
        // Guest: show hamburger toggle
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <HiOutlineX size={28} className="text-white" />
            ) : (
              <HiOutlineMenu size={28} className="text-white" />
            )}
          </button>
        </div>
      ) : (
        // Auth: show avatar + name directly (no toggle)
        <div className="md:hidden flex items-center relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="text-white flex items-center gap-2 cursor-pointer"
          >
            <FaUserCircle size={28} />
            <span className="font-semibold">{user.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg w-44 py-2 z-50">
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Orders
              </Link>
              <Link
                to="/cart"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Cart
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu for Guest */}
      {isOpen && !user && (
        <div className="absolute top-20 left-0 w-full bg-(--color-dark-gray) flex flex-col items-center py-6 space-y-4 md:hidden z-50">
          {links.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`${linkBase} ${
                page === link.key ? activeColor : inactiveColor
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-(--color-dark-gray) bg-(--color-light-gray) text-lg font-semibold py-2 px-6 rounded-full w-3/4 text-center"
          >
            Login
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="text-(--color-dark-gray) bg-(--color-green) text-lg font-semibold py-2 px-6 rounded-full w-3/4 text-center"
          >
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
