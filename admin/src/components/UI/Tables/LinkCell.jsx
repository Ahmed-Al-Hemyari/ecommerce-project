import { Link } from 'react-router-dom';

const LinkCell = ({ item, header }) => {
  const value = item[header.field];

  if (!value || typeof value !== 'object') {
    return (
      <td className="p-3 border-b text-base text-(--color-dark-gray)">
        -
      </td>
    );
  }

  return (
    <td className="p-3 border-b text-base font-medium text-(--color-dark-green)">
      <Link
        to={`/${header.link}/show/${value._id}`}
        className="hover:underline"
      >
        {value.name}
      </Link>
    </td>
  );
};

export default LinkCell;