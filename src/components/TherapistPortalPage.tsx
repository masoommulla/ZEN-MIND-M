import { useState, useEffect } from 'react';
import { TherapistLogin } from './TherapistLogin';
import { TherapistPortal } from './TherapistPortal';
import { useNavigate } from 'react-router-dom';

export function TherapistPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [therapist, setTherapist] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if therapist is already logged in
    const savedToken = localStorage.getItem('therapistToken');
    const savedTherapist = localStorage.getItem('currentTherapist');

    if (savedToken && savedTherapist) {
      setToken(savedToken);
      setTherapist(JSON.parse(savedTherapist));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (therapistData: any, tokenData: string) => {
    setTherapist(therapistData);
    setToken(tokenData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('therapistToken');
    localStorage.removeItem('currentTherapist');
    setTherapist(null);
    setToken('');
    setIsLoggedIn(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!isLoggedIn) {
    return <TherapistLogin onLoginSuccess={handleLoginSuccess} onBack={handleBack} />;
  }

  return <TherapistPortal therapist={therapist} token={token} onLogout={handleLogout} />;
}
