import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../../App";

const ProtectedRoute = ({ children }) => {
  const context = useContext(MyContext);

  if (!context?.isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
