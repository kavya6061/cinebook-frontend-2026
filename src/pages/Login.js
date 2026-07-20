import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      setError('Please fill in both name and email');
      return;
    }
    await login(name, email);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo-big">🎬</div>
          <h1>CineBook</h1>
          <p>Your gateway to the best movie experiences. Book seats, grab snacks, and enjoy the show.</p>
          <div className="auth-features">
            <div className="auth-feature">🎟️ Instant seat booking</div>
            <div className="auth-feature">🍿 Snacks at your seat</div>
            <div className="auth-feature">⚡ Real-time seat availability</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Login to book your favorite movies</p>
          <form onSubmit={handleLogin}>
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email or Phone" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="action-btn full-width">Login</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p>New user? <Link to="/signup">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;