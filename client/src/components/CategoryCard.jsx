import React from "react";
import { iconMap } from "@/services/icons.js";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const Icon = iconMap[category.icon];

  return (
    <Link to={`/products?category=${category.slug}`}>
        <div
            key={category.id}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
        >
            <div className="text-3xl mb-3">
                <Icon size={28} className="text-green" />
            </div>

            <div className="font-medium text-center">{category.name}</div>
        </div>
    </Link>
  );
};

export default CategoryCard;
