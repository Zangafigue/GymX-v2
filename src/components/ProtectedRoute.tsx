import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gym-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gym-red"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" />; // Redirect simple users away from admin dashboard
  }

  return <>{children}</>;
};

export default ProtectedRoute;
