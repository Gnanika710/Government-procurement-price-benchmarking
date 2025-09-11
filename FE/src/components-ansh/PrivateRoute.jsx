import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  const isAuthenticated = !!currentUser ;

  return isAuthenticated ? <Outlet /> : <Navigate to={currentUser && '/retailer-signin' } />;
}
