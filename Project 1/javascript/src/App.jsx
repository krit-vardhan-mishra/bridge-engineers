import React from 'react';
import AppRoutes from './frontend/routes/AppRoutes';
import { AuthProvider } from './frontend/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
