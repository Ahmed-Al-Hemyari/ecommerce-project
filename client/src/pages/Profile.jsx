import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useSnackbar } from 'notistack';
import Spinner from "@/components//Spinner";
import defaultAvatar from "@/assets/default-avatar.png";
import { authService, shippingService } from "../services/api-calls";
import ShippingCard from "../components/ShippingCard"; // make sure this exists
import ActionButton from "../components/ActionButton";
import { PlusSquare } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // FETCH PROFILE FROM API
  // -----------------------
  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setUser(data.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      enqueueSnackbar("Failed to load profile. Please login again.", { variant: "error" });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // INITIAL LOAD
  // -----------------------
  useEffect(() => {
    loadProfile();
  }, []);

  // -----------------------
  // Snackbar listener
  // -----------------------
  useEffect(() => {
    if (location.state?.message) {
      enqueueSnackbar(location.state.message, {
        variant: location.state.status,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  // -----------------------
  // LOGOUT
  // -----------------------
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sure you want to log out?",
      icon: "question",
      showCloseButton: true,
      confirmButtonText: "Yes, log out!",
      showCancelButton: true,
      confirmButtonColor: "#82E2BB",
      allowOutsideClick: false,
      preConfirm: async () => {
        Swal.showLoading();
        try {
          await authService.logout();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (error) {
          Swal.showValidationMessage(`Failed to logout: ${error}`);
          return false;
        }
      }
    });

    if (result.isConfirmed) {
      navigate('/login', {
        state: {
          message: "Logged out successfully",
          status: "success"
        }
      });
    }
  };

  // -----------------------
  // SET DEFAULT SHIPPING
  // -----------------------
  const setDefaultShipping = async (shippingId) => {
    // Call your API to set default shipping
    await shippingService.setDefault(shippingId);

    // Refresh profile after change
    await loadProfile();
  };
  
  // -----------------------
  // DELETE SHIPPING
  // -----------------------
  const deleteShipping = async (shippingId) => {
    // Call your API to delete shipping
    await shippingService.deleteShipping(shippingId);
    // Refresh profile after change
    await loadProfile();
  };

  // -----------------------
  // RENDER
  // -----------------------

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spinner />
      </div>
    </MainLayout>
  );

  if (!user) return null;

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
          <p className="text-gray-500">Joined at: {' '}
            {
              <span className="font-bold">
                {new Date(user.createdAt).toLocaleDateString('utc', { month: 'long', day: '2-digit', year: 'numeric' })}
              </span>
            }
          </p>
        </div>

        <div className="my-6 border-t border-(--color-light-gray)/40"></div>

        {/* User Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-(--color-dark-gray) font-medium">{user.name}</p>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex-col">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-(--color-dark-gray) font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-(--color-dark-gray) font-medium">{user.phone}</p>
              </div>
            )}
          </div>
        </div>
        <div className="my-6 border-t border-(--color-light-gray)/40"></div>

        {/* Shippings */}
        {user.shippings && user.shippings.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex w-full justify-between">
              <h2 className="text-xl font-semibold text-(--color-dark-gray)">Saved Shippings</h2>
              {user.shippings.length <= 5 ? (
                <ActionButton
                  Icon={PlusSquare}
                  tooltip={'Add Shipping'}
                  size={22}
                  color="#333333"
                  handleClick={() => navigate(`/profile/shippings/create`)}
                />
              ) : null}
            </div>
            {user.shippings.map(shipping => (
              <ShippingCard 
                key={shipping._id} 
                shipping={shipping} 
                onSetDefault={setDefaultShipping}
                onDelete={deleteShipping}
              />
            ))}
            {
              user.shippings.length <= 5 ? 
              <button
                onClick={() => navigate("/profile/shippings/create")}
                className="w-full py-1 rounded-xl border border-(--color-dark-gray)/30 
                          text-(--color-dark-gray) font-medium hover:bg-(--color-light-gray)/10"
              >
                + Add New Shipping
              </button>
              : null
            }
          </div>
        )}

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
