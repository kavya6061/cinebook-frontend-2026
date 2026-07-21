import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="logo" onClick={closeMenu}>🎬 CineBook</Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {user && (
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
          <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
          <Link to="/spin" onClick={closeMenu}>Spin & Win</Link>
          <Link to="/offers" onClick={closeMenu}>Offers</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <Link to="/profile" onClick={closeMenu}>👤 {user.name}</Link>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;