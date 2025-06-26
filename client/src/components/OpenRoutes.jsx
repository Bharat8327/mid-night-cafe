import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function OpenRoutes() {
  const token = 'hshhs';
  const role = 'ram';

  if (token) {
    return <Navigate to="/" />;
  }

  if (role) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default OpenRoutes;
