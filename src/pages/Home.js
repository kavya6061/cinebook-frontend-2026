import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../api';

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'];
const LANGUAGE_COLORS = {
  Hindi: '#ff3d81', Kannada: '#ffb03d', Telugu: '#3dff95', Tamil: '#a83dff', English: '#3da8ff', Marathi: '#ff6b3d',
};
const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Sci-Fi', 'Crime', 'Fantasy'];

function Home() {
  const [movies, setMovies] = useState([]);
  const [city, setCity] = useState('Bangalore');
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeGenre, setActiveGenre] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    getMovies().then((res) => setMovies(res.data)).catch(() => setMovies([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('sbs_wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleWishlist = (e, movieId, movieTitle) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const isAdding = !prev.includes(movieId);
      const updated = isAdding ? [...prev, movieId] : prev.filter((id) => id !== movieId);
      localStorage.setItem('sbs_wishlist', JSON.stringify(updated));
      setToast(isAdding ? `${movieTitle} added to wishlist` : `${movieTitle} removed from wishlist`);
      setTimeout(() => setToast(''), 2000);
      return updated;
    });
  };

  const suggestions = search.trim()
    ? movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const genreFiltered = activeGenre === 'All' ? movies : movies.filter((m) => m.genre === activeGenre);
  const filteredMovies = search.trim()
    ? genreFiltered.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : genreFiltered;

  const trending = [...movies].slice(0, 6);

  const goToMovie = (id) => {
    setShowSuggestions(false);
    navigate(`/movie/${id}`);
  };

  const renderMovieCard = (movie) => (
    <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="poster-placeholder">🎬</div>
      <span className="lang-badge" style={{ background: LANGUAGE_COLORS[movie.language] || '#ff3d81' }}>
        {movie.language}
      </span>
      <span className="wishlist-heart" onClick={(e) => toggleWishlist(e, movie.id, movie.title)}>
        {wishlist.includes(movie.id) ? '❤️' : '🤍'}
      </span>
      <h4>{movie.title}</h4>
      <p className="movie-meta">{movie.genre}</p>
      <p className="movie-meta">{movie.durationMinutes} min</p>
    </div>
  );

  return (
    <div className="page-container">
      {toast && <div className="toast-message">{toast}</div>}

      <div className="hero-banner">
        <h1>Book Your Next <span className="highlight">Movie Experience</span></h1>
        <p>Find the best movies playing near you</p>
      </div>

      <div className="top-bar" ref={searchRef}>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="city-select">
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="search-wrapper">
          <input
            className="search-bar"
            placeholder="Search movies, genres..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((m) => (
                <div key={m.id} className="suggestion-item" onClick={() => goToMovie(m.id)}>
                  <span className="suggestion-icon">🎬</span>
                  <div>
                    <div className="suggestion-title">{m.title}</div>
                    <div className="suggestion-meta">{m.language} • {m.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="banner">🍿 Grand Opening Offer — Book 2 tickets, get snacks free!</div>

      {trending.length > 0 && (
        <>
          <h3 className="section-title">🔥 Trending Now</h3>
          <div className="movie-grid trending-row">
            {trending.map(renderMovieCard)}
          </div>
        </>
      )}

      <h3 className="section-title">Now Showing in {city}</h3>

      <div className="genre-tabs">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-tab ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setActiveGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <p className="empty-text">No movies found for this filter.</p>
      )}

      <div className="movie-grid">
        {filteredMovies.map(renderMovieCard)}
      </div>
    </div>
  );
}

export default Home;