import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // prevents UI flashing

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return navigate("/login", {
          state: {
            message: "Please login first!!",
            status: "warning",
          },
        });
      }

      try {
        const response = await authService.checkAuthAndAdmin();

        if (!response.data.isAdmin) {
          return navigate("/login", {
            state: {
              message: "Unauthorized access!! Admins only.",
              status: "error",
            },
          });
        }

        // If admin → allow page
        setLoading(false);

      } catch (error) {
        console.log(error);
        navigate("/login", {
          state: {
            message: "Authentication error!",
            status: "error",
          },
        });
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div className="p-10 text-center">Checking permissions...</div>;
  }

  return children;
};

export default ProtectedRoute;
