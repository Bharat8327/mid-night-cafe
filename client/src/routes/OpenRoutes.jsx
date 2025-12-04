import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/utils.js';

function OpenRoutes() {
  const authenticated = getCookie('authenticated'); 
  const id = getCookie('id'); 
  const role = getCookie('role'); 

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
