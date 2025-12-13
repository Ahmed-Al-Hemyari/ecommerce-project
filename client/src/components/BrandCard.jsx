import React from 'react'
const url = import.meta.env.VITE_IMAGES_BACKEND_URL;
import defaultBrandImage from "../assets/default-brand-image.jpg";
import { Link } from 'react-router-dom';

const BrandCard = ({brand}) => {
  return (
    <Link to={`/products?brand=${brand._id}`}>
        <div
            key={brand._id}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
        >
            <div className="text-3xl mb-3">
                <img
                    src={brand.logo ? `${url}${brand.logo}` : defaultBrandImage}
                    alt={brand.title}
                    className="w-full h-18 rounded-2xl object-cover"
                />
            </div>

            <div className="font-medium text-center">{brand.name}</div>
        </div>
    </Link>
  );
}

export default BrandCard