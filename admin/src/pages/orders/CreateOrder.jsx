import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/Layouts/MainLayout'
import CreateForm from '@/components/UI/Forms/CreateForm';
import Dropdown from '@/components/UI/Forms/Dropdown';
import SearchSelect from '@/components/UI/Forms/SearchSelect';
import userService from '@/services/userService';

const CreateOrder = () => {
  // Search
  const [userSearch ,setUserSearch] = useState("");

  const [users, setUsers] = useState();
  const [user, setUser] = useState({
    id: "",
    name: ""
  });
  const [items, setItems] = useState([]);
  const [itemsNumber, setItemsNumber] = useState(0);
  const [shippingData, setShippingData] = useState({
    address1: "",
    address2: "",
    city: "",
    zip: "",
    country: "",
    paymentMethod: "cod",
  });
  const [totalAmount, setTotalAmount] = useState();

  const resetForm = () => {
    setUser('');
    setItems([]);
    setItemsNumber(0);
    setShippingData({
      address1: "",
      address2: "",
      city: "",
      zip: "",
      country: "",
      paymentMethod: "cod",
    });
    setTotalAmount(0);
  }

  const getUsers = async (searchText = "") => {
    try {
      const response = await userService.getUsers();
      const formatted = response.data.map(user => ({
        ...user,
        role: String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1),
        createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }));
      setUsers(formatted);
    } catch (error) {
      enqueueSnackbar("Failed to load users", { variant: 'error' });
      console.error(error);
    }
  }

  useEffect(() => {
     if (userSearch.length > 0) {
      const delay = setTimeout(() => {
        getUsers(userSearch);
      }, 400);

      return () => clearTimeout(delay);
    }
  }, [userSearch]);

  return (
    <MainLayout>
      <div className='flex flex-row justify-between mb-5 px-2 py-3'>
        <h1 className='text-3xl font-medium'>Create Order</h1>
      </div>
      <div className='flex flex-row justify-end my-5'>
        <button
            onClick={resetForm}
            type="button"
            className="px-4 py-2 rounded-md border qb-border bg-gray-200 
                        text-(--color-dark-gray) cursor-pointer"
        >
            Reset
        </button>
      </div>
      <form action="">
        <SearchSelect
          label="User"
          placeholder="Search user..."
          important
          value={userSearch}
          setValue={setUserSearch}
          results={users}
          headers={["name", "email"]}
          onSelect={setUser}
        />
      </form>
    </MainLayout>
  )
}

export default CreateOrder