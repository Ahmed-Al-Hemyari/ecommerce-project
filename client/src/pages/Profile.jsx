import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { readLocalStorageItem } from "@/services/LocalStorageFunctions";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default-avatar.png";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = readLocalStorageItem("user");
    if (!storedUser) navigate("/login");
    setUser(storedUser);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
      const result = await Swal.fire({
        title: "Sure you want to log out?",
        icon: "question",
        showCloseButton: true,
        confirmButtonText: "Yes, log out!",
        showCancelButton: true,
        confirmButtonColor: "#82E2BB"
      });
  
      if (!result.isConfirmed) return;
  
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigate('/', {
        state: {
          message: "Logged out successfully",
          status: "success"
        }
      });
    };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">

        {/* Avatar + Name */}
        <div className="flex flex-col items-center text-center">
          <img
            src={defaultAvatar}
            className="w-32 h-32 rounded-full border-2 border-(--color-light-gray) object-cover"
          />

          <h1 className="text-2xl font-semibold text-(--color-dark-gray) mt-3">
            {user.name}
          </h1>

          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="my-6 border-t border-(--color-light-gray)/40"></div>

        {/* User Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-(--color-dark-gray) font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-(--color-dark-gray) font-medium">{user.email}</p>
          </div>

          {user.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-(--color-dark-gray) font-medium">{user.phone}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-(--color-dark-gray) font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">

          {/* Edit Profile */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-full py-3 rounded-xl text-black font-medium bg-(--color-green) hover:bg-(--color-green)/90"
          >
            Edit Profile
          </button>

          {/* Change Password */}
          <button
            onClick={() => navigate("/profile/change-password")}
            className="w-full py-3 rounded-xl border border-(--color-dark-green) text-(--color-dark-green) font-medium hover:bg-(--color-green)/10"
          >
            Change Password
          </button>

          {/* View Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 rounded-xl border border-(--color-dark-gray)/30 
                       text-(--color-dark-gray) font-medium hover:bg-(--color-light-gray)/10"
          >
            View Orders
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-red-500 font-medium hover:bg-red-50"
          >
            Logout
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default Profile;
