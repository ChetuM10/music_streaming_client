import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AdminRoute = () => {
  const { profile } = useAuthStore();

  if (!profile?.is_admin) {
    // Redirect non-admins to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
