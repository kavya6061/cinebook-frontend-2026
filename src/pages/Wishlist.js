import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../api';

function Wishlist() {
  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMovies().then((res) => setMovies(res.data));
    const saved = localStorage.getItem('sbs_wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const wishlistMovies = movies.filter((m) => wishlist.includes(m.id));

  const removeFromWishlist = (e, movieId) => {
    e.stopPropagation();
    const updated = wishlist.filter((id) => id !== movieId);
    setWishlist(updated);
    localStorage.setItem('sbs_wishlist', JSON.stringify(updated));
  };

  return (
    <div className="page-container">
      <h2>My Wishlist</h2>
      {wishlistMovies.length === 0 && (
        <p className="empty-text">You haven't added any movies to your wishlist yet.</p>
      )}
      <div className="movie-grid">
        {wishlistMovies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
            <div className="poster-placeholder">🎬</div>
            <span className="wishlist-heart" onClick={(e) => removeFromWishlist(e, movie.id)}>❤️</span>
            <h4>{movie.title}</h4>
            <p className="movie-meta">{movie.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;