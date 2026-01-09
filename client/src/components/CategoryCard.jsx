import React from "react";
import { iconMap } from "@/services/icons.js";
import { Link, useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const Icon = iconMap[category.slug];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/products', {
      state: {
        categoryId: category._id,
      }
    });
  }

  return (
    <button onClick={handleClick}>
        <div
            key={category.id}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
        >
            <div className="text-3xl mb-3">
              {Icon ? (
                <Icon size={28} className="text-green" />
              ): ''}
            </div>

            <div className="font-medium text-center">{category.name}</div>
        </div>
    </button>
  );
};

export default CategoryCard;
