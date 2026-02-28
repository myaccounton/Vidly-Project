import { useState, useEffect } from 'react';
import auth from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    updateUser();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateUser = () => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
  };

  const handleStorageChange = () => {
    updateUser();
  };

  return { user, updateUser };
};

export default useAuth;
