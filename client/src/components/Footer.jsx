import React from 'react'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
      <footer className="mt-8 bg-(--color-dark-gray) text-(--color-light-gray)">
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h5 className="font-semibold mb-3 text-white">QuickBuy</h5>
            <p className="text-sm">Fast delivery. Great deals. Trusted shopping.</p>
          </div>

          <div>
            <h6 className="font-medium mb-2">Shop</h6>
            <ul className="text-sm space-y-1">
            <li>New Arrivals</li>
            <li>Best Sellers</li>
            <li>Offers</li>
            </ul>
          </div>

          <div>
            <h6 className="font-medium mb-2">Support</h6>
            <ul className="text-sm space-y-1">
                <li>Help Center</li>
                <li>Returns</li>
                <li>Track Order</li>
            </ul>
          </div>

          <div>
            <h6 className="font-medium mb-2">Company</h6>
            <ul className="text-sm space-y-1">
                <Link to={'/about'}><li>About Us</li></Link>
                <li>Careers</li>
                <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-(--color-light-gray)/30 p-4 text-sm text-center text-(--color-light-gray)">© {new Date().getFullYear()} QuickBuy — All rights reserved</div>
      </footer>
  )
}

export default Footer