import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MillLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth/session data
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login
    navigate('/login');
  }, []);

  return <div>Logging out...</div>;
};

export default MillLogout;
