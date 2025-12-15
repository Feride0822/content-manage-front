import { Navigate } from "react-router-dom";
import { STORAGE_KEYS } from "../constants/auth.constants";
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
