import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Logout page component for Mill Dashboard
const MillLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication and session data from browser storage
    localStorage.clear();
    sessionStorage.clear();
    // Redirect user to login page after logout
    navigate('/login');
  }, []);

  // Display logging out message while redirecting
  return <div>Logging out...</div>;
};

export default MillLogout;