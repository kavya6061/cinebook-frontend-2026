import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie } from '../api';
import { useBooking } from '../context/BookingContext';

// Cast info per movie (lowercase title as key)
const CAST_MAP = {
  'pathaan': { actor: 'Shah Rukh Khan', actress: 'Deepika Padukone', supporting: 'John Abraham' },
  'jawan': { actor: 'Shah Rukh Khan', actress: 'Nayanthara', supporting: 'Vijay Sethupathi' },
  'animal': { actor: 'Ranbir Kapoor', actress: 'Rashmika Mandanna', supporting: 'Bobby Deol' },
  'gadar 2': { actor: 'Sunny Deol', actress: 'Ameesha Patel', supporting: 'Utkarsh Sharma' },
  'kgf chapter 2': { actor: 'Yash', actress: 'Srinidhi Shetty', supporting: 'Sanjay Dutt' },
  'kantara': { actor: 'Rishab Shetty', actress: 'Sapthami Gowda', supporting: 'Kishore Kumar G' },
  '777 charlie': { actor: 'Rakshit Shetty', actress: 'Charlie (the dog)', supporting: 'Sangeetha Sringeri' },
  'rrr': { actor: 'N. T. Rama Rao Jr.', actress: 'Alia Bhatt', supporting: 'Ram Charan' },
  'pushpa: the rise': { actor: 'Allu Arjun', actress: 'Rashmika Mandanna', supporting: 'Fahadh Faasil' },
  'baahubali 2': { actor: 'Prabhas', actress: 'Anushka Shetty', supporting: 'Rana Daggubati' },
  'sairat': { actor: 'Akash Thosar', actress: 'Rinku Rajguru', supporting: 'Tanaji Galgunde' },
  'natsamrat': { actor: 'Nana Patekar', actress: 'Medha Manjrekar', supporting: 'Vikram Gokhale' },
  'baipan bhari deva': { actor: 'Nirmiti Sawant', actress: 'Vandana Gupte', supporting: 'Suchitra Bandekar' },
  'oppenheimer': { actor: 'Cillian Murphy', actress: 'Emily Blunt', supporting: 'Matt Damon' },
  'avengers: endgame': { actor: 'Robert Downey Jr.', actress: 'Scarlett Johansson', supporting: 'Chris Evans' },
  'interstellar': { actor: 'Matthew McConaughey', actress: 'Anne Hathaway', supporting: 'Jessica Chastain' },
};

function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  useEffect(() => {
    getMovie(movieId)
      .then((res) => setMovie(res.data))
      .catch(() => setError('Failed to load movie details. Please check if the server is running.'));
  }, [movieId]);

  useEffect(() => {
    // Load saved reviews for this movie from localStorage
    const saved = localStorage.getItem(`reviews_${movieId}`);
    if (saved) setReviews(JSON.parse(saved));
  }, [movieId]);

  if (error) return <div className="page-container"><p className="error-text">{error}</p></div>;
  if (!movie) return <div className="page-container">Loading...</div>;

  const handleBookTickets = () => {
    updateBooking({ movie });
    navigate(`/movie/${movieId}/theatres`);
  };

  const cast = CAST_MAP[movie.title.toLowerCase()] || { actor: 'Lead Actor', actress: 'Lead Actress', supporting: 'Supporting Cast' };
  const searchQuery = encodeURIComponent(`${movie.title} official trailer`);

  const handleSubmitRating = () => {
    if (userRating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }
    if (!reviewText.trim()) {
      setError('Please write a short review before submitting.');
      return;
    }
    const newReview = { rating: userRating, text: reviewText, date: new Date().toLocaleDateString() };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updated));
    setUserRating(0);
    setReviewText('');
    setShowRatingForm(false);
    setError('');
  };

  return (
    <div className="page-container">
      <div className="movie-detail-header">
        <div className="poster-placeholder large">🎬</div>
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>
          <p className="movie-meta">{movie.language} • {movie.genre} • {movie.durationMinutes} min</p>
          <div className="rating-box">⭐ 4.3/5 (12.5k votes)</div>
          <button className="action-btn" onClick={handleBookTickets}>Book Tickets</button>
        </div>
      </div>

      <div className="trailer-section">
        {showTrailer ? (
          <div className="trailer-embed">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed?listType=search&list=${searchQuery}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <button className="action-btn secondary" onClick={() => setShowTrailer(true)}>
            ▶ Watch Trailer
          </button>
        )}
      </div>

      <div className="synopsis-section">
        <h3>About the Movie</h3>
        <p>{movie.title} is a {movie.genre.toLowerCase()} film that takes audiences on a thrilling journey. Directed with stunning visuals and a gripping story, this {movie.language} film has been a favorite among fans.</p>
        <h4>Cast</h4>
        <div className="cast-list">
          <span className="cast-chip">{cast.actor}</span>
          <span className="cast-chip">{cast.actress}</span>
          <span className="cast-chip">{cast.supporting}</span>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Ratings & Reviews</h3>
          <button className="action-btn secondary small" onClick={() => setShowRatingForm(!showRatingForm)}>
            {showRatingForm ? 'Cancel' : '+ Rate This Movie'}
          </button>
        </div>

        {showRatingForm && (
          <div className="rating-form">
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${userRating >= star ? 'filled' : ''}`}
                  onClick={() => setUserRating(star)}
                >
                  ⭐
                </span>
              ))}
            </div>
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-textarea"
            />
            <button className="action-btn full-width" onClick={handleSubmitRating}>Submit Review</button>
            {error && <p className="error-text">{error}</p>}
          </div>
        )}

        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <strong>{'⭐'.repeat(r.rating)}</strong>
            <p>"{r.text}"</p>
            <span className="review-date">{r.date}</span>
          </div>
        ))}

        <div className="review-card">
          <strong>⭐⭐⭐⭐⭐</strong>
          <p>"Amazing watch, great direction and performances!"</p>
        </div>
        <div className="review-card">
          <strong>⭐⭐⭐⭐</strong>
          <p>"Good movie, could have been a bit shorter."</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;