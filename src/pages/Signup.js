import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('It is mandatory to fill all sections');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError('Password must be at least 8 characters and include a letter, a number, and a special character (@$!%*#?&)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    await login(name, email, password);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo-big">🎬</div>
          <h1>CineBook</h1>
          <p>Join thousands of movie lovers booking their favorite shows every day.</p>
          <div className="auth-features">
            <div className="auth-feature">🎟️ Instant seat booking</div>
            <div className="auth-feature">🍿 Snacks at your seat</div>
            <div className="auth-feature">⚡ Real-time seat availability</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join CineBook to start booking</p>
          <form onSubmit={handleSignup}>
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email or Phone" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <p className="password-hint">
              Password must be 8+ characters with a letter, number, and special character (@$!%*#?&)
            </p>

            <button type="submit" className="action-btn full-width">Sign Up</button>
          </form>
          {error && <p className="error-text">{error}</p>}
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;