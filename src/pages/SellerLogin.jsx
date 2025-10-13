import Page from '../components/Page';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function SellerLogin() {
  const { user, role, loading, signInGoogle, signInEmail } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!loading && user && role === 'seller') return nav('/seller/dashboard');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await signInEmail(email, password);
    nav('/seller/onboarding'); // first stop is plan selection
  };

  const handleGoogle = async () => {
    await signInGoogle();
    nav('/seller/onboarding');
  };

  return (
    <Page>
      <section className="auth-card">
        <h1>Seller Login / Sign Up</h1>
        <form onSubmit={handleEmailLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn">Login</button>
        </form>
        <button className="btn btn-secondary" onClick={handleGoogle}>Continue with Google</button>
        <p>New seller? <Link to="/seller/onboarding">Choose a plan</Link></p>
      </section>
    </Page>
  );
}
