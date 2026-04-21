import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useAuthDialog } from '../context/AuthDialogContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { currentUser } = useAppSelector((state) => state.users);
  const hasToken = Boolean(localStorage.getItem('token'));
  const { openAuth } = useAuthDialog();

  useEffect(() => {
    if (!currentUser && !hasToken) {
      openAuth();
    }
  }, [currentUser, hasToken, openAuth]);

  // Still fetching user from token — show nothing
  if (!currentUser && hasToken) {
    return null;
  }

  // Not logged in — open dialog and redirect to home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
