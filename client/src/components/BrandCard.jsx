import { useNavigate } from 'react-router-dom';

const BrandCard = ({ brand }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_IMAGES_BACKEND_URL;

  const handleClick = () => {
    navigate('/products', {
      state: {
        brandId: brand._id,
      }
    });
  };

  return (
    <button onClick={handleClick}>
      <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-1 flex flex-col items-center">
        <img
          src={brand.logo ? `${url}${brand.logo}` : defaultBrandImage}
          alt={brand.name}
          className="h-18 rounded-2xl object-cover mb-2"
        />
        <div className="font-medium text-center">{brand.name}</div>
      </div>
    </button>
  );
};

export default BrandCard;