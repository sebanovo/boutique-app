import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { server } from '../utils/server';

function ProtectedRoute({ children }) {
  return children;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await server().validateSession();

        if (response.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error validando sesión:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-lg'>Verificando sesión...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
}

export default ProtectedRoute;
