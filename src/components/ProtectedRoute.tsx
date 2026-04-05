import { Navigate, Outlet } from 'react-router-dom';
import { useFinanceStore } from '../stores/financeStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useFinanceStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
