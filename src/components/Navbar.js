import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎬 CineBook</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/spin">Spin & Win</Link>
            <Link to="/offers">Offers</Link>
            <Link to="/about">About</Link>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/profile">👤 {user.name}</Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;