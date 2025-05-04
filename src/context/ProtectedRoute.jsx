import { Navigate, Outlet } from "react-router-dom";
import propTypes from "prop-types";

ProtectedRoute.propTypes = {
  children: propTypes.node,
  isAllowed: propTypes.bool,
  redirectTo: propTypes.string,
};

export default function ProtectedRoute({ children, isAllowed, redirectTo }) {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
}
