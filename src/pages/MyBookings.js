import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../api';

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      getUserBookings(user.email)
        .then((res) => setBookings(res.data))
        .catch(() => setBookings([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.show.showTime) >= now);
  const past = bookings.filter((b) => new Date(b.show.showTime) < now);

  if (loading) return <div className="page-container">Loading your bookings...</div>;

  return (
    <div className="page-container">
      <h2>My Bookings</h2>

      <h3 className="section-title" style={{ fontSize: '18px', marginTop: '20px' }}>Upcoming</h3>
      {upcoming.length === 0 && <p className="empty-text">No upcoming bookings.</p>}
      {upcoming.map((b) => (
        <div key={b.id} className="summary-card">
          <h4>{b.show.movie.title}</h4>
          <p className="movie-meta">{new Date(b.show.showTime).toLocaleString()}</p>
          <p className="movie-meta">Status: {b.bookingStatus}</p>
          <h3>₹{b.totalAmount}</h3>
        </div>
      ))}

      <h3 className="section-title" style={{ fontSize: '18px', marginTop: '30px' }}>Past Bookings</h3>
      {past.length === 0 && <p className="empty-text">No past bookings.</p>}
      {past.map((b) => (
        <div key={b.id} className="summary-card" style={{ opacity: 0.7 }}>
          <h4>{b.show.movie.title}</h4>
          <p className="movie-meta">{new Date(b.show.showTime).toLocaleString()}</p>
          <p className="movie-meta">Status: {b.bookingStatus}</p>
          <h3>₹{b.totalAmount}</h3>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;