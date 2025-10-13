import Page from '../components/Page';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function BuyerLogin() {
  const { user, role, loading, signInGoogle, signInEmail, signUpEmail } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!loading && user) {
    // already logged in
    return nav('/buyer/dashboard');
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await signInEmail(email, password);
    nav('/buyer/dashboard');
  };

  const handleGoogle = async () => {
    await signInGoogle();
    nav('/buyer/dashboard');
  };

  return (
    <Page>
      <section className="auth-card">
        <h1>Buyer Login / Sign Up</h1>
        <form onSubmit={handleEmailLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn">Login</button>
        </form>
        <button className="btn btn-secondary" onClick={handleGoogle}>Continue with Google</button>
        <p>New here? <Link to="/buyer/login">Create an account (use Google or email)</Link></p>
      </section>
    </Page>
  );
}
