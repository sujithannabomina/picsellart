// src/pages/BuyerLogin.jsx
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BuyerLogin() {
  const { user, signInBuyer } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    (async () => {
      if (!user) await signInBuyer();
      // go back to Explore if came from buy, else stay on buyer dashboard
      navigate('/buyer', { replace: true, state: { from: loc.state?.from || '/' } });
    })();
  }, [user]);

  return <div className="max-w-3xl mx-auto px-4 py-10">Signing you in…</div>;
}
