import React, { useState } from "react";
import logo from "@/assets/quickbuylogo.svg";
import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = ({ page }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const linkBase =
    "text-lg font-semibold transition-all duration-300";
  const activeColor = "text-(--color-green)";
  const inactiveColor = "text-white hover:text-(--color-green)";

  const links = [
    { name: "Home", to: "/", key: "home" },
    { name: "Shop", to: "/products", key: "products" },
    { name: "About", to: "/about", key: "about" },
    // { name: "Contact", to: "/contact", key: "contact" }
  ];

  return (
    <nav className="w-full bg-(--color-dark-gray) flex items-center justify-between px-6 md:px-10 h-20 relative">
      {/* Logo */}
      <Link to={'/'}>
        <img src={logo} alt="QuickBuy Logo" className="w-36 md:w-40" />
      </Link>
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
      {/* Desktop Links */}
      <div className="hidden md:flex gap-3 items-center">
        <Link to={'/login'} className="px-4 py-2 rounded-md bg-(--color-light-gray) border qb-border">Login</Link>
        <Link to={'/cart'} className="px-4 py-2 rounded-md bg-(--color-green)">Cart</Link>
      </div>  
      {/* <div className="hidden md:flex items-center gap-10">
        <Link
          to="/login"
          className="text-(--color-dark-gray) bg-(--color-green) text-lg font-semibold py-2 px-6 rounded-full transition-all duration-300"
        >
          Login
        </Link>
      </div> */}


      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu}>
          {isOpen ? (
            <HiOutlineX size={28} className="text-white" />
          ) : (
            <HiOutlineMenu size={28} className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-(--color-dark-gray) flex flex-col items-center py-6 space-y-6 md:hidden z-50">
          {links.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setIsOpen(false)} // close menu on click
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
            className="text-(--color-dark-gray) bg-(--color-light-gray) text-lg font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="text-(--color-dark-gray) bg-(--color-green) text-lg font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
