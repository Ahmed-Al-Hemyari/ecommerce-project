import brandService from '@/services/brandService';
import categoryService from '@/services/categoryService';
import userService from '@/services/userService';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LinkCell = ({ item, header }) => {
  // const value = item[header.field];
  // console.log(header.field);
  // const [valueType, setValueType] = useState(null);
  const [value, setValue] = useState(null);



  const getValue = async () => {
    try {
      let response;
      switch (header.field) {
        case 'category':
          // response = await categoryService.getCategory(item.category._id);
          setValue(item.category);
          break;
        case 'brand':
          // response = await brandService.getBrand(item.brand._id);
          setValue(item.brand);
          break;
        case 'user':
          // response = await userService.getUser(item.user._id);
          setValue(item.user);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getValue();
  }, []);

  if (!value || typeof value !== 'object') {
    return (
      <td className="p-3 border-b text-base text-(--color-dark-gray)">
        -
      </td>
    );
  }

  return (
    <td className={`p-3 border-b text-base font-medium ${value.deleted ? 'text-[#dd2222]' : ' text-(--color-dark-green)'}`}>
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