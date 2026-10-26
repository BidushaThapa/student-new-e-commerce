import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <p className="p-8 text-center text-slate-600">Loading your account…</p>
    );
  }
  return user ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location }} to="/login" />
  );
}
