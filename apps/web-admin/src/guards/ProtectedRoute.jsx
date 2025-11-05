import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialize } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setIsInitializing(false);
    };

    initAuth();
  }, [initialize]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
