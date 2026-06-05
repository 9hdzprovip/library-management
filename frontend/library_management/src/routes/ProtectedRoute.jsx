import { Navigate, Outlet } from 'react-router-dom';

function getCurrentRole() {
  return (localStorage.getItem('role') || 'USER').toUpperCase();
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const role = getCurrentRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
