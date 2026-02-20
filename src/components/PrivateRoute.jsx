import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return  <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;