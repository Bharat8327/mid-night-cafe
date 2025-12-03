import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/utils.js';

function OpenRoutes() {
  const authenticated = getCookie('authenticated'); // assuming token is stored with name 'token'
  const id = getCookie('id'); // optional, if you store user role
  const role = getCookie('role'); // optional, if you store user role

  if (authenticated && id) {
    return role === 'Admin' ? (
      <Navigate to="/admin/menu" />
    ) : (
      <Navigate to="/dashboard" />
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default OpenRoutes;
