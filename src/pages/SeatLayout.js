import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeatStatus, lockSeats } from '../api';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

function SeatLayout() {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { booking, updateBooking } = useBooking();
  const navigate = useNavigate();
  const showId = booking.show?.id;

  const fetchSeats = useCallback(() => {
    if (!showId) return;
    getSeatStatus(showId).then((res) => setSeats(res.data)).catch(() => {});
  }, [showId]);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 5000);
    return () => clearInterval(interval);
  }, [fetchSeats]);

  const toggleSeat = (s) => {
    if (s.status !== 'AVAILABLE') return;
    setSelected((prev) => prev.includes(s.seat.id) ? prev.filter((id) => id !== s.seat.id) : [...prev, s.seat.id]);
  };

  const price = (s) => (s.seat.seatType === 'PREMIUM' ? booking.show.pricePremium : booking.show.priceNormal);
  const total = seats.filter((s) => selected.includes(s.seat.id)).reduce((sum, s) => sum + price(s), 0);

  const seatClass = (s) => {
    if (selected.includes(s.seat.id)) return 'seat selected';
    if (s.status === 'BOOKED') return 'seat booked';
    if (s.status === 'LOCKED') return 'seat locked';
    return s.seat.seatType === 'PREMIUM' ? 'seat available premium' : 'seat available';
  };

  const handleProceed = () => {
    if (selected.length === 0) {
      setMessage('Kam se kam ek seat select karo');
      return;
    }
    lockSeats(showId, selected, user.sessionId)
      .then(() => {
        const seatDetails = seats.filter((s) => selected.includes(s.seat.id));
        updateBooking({ selectedSeats: selected, seatDetails, totalAmount: total });
        navigate('/food');
      })
      .catch((err) => setMessage(err.response?.data?.message || 'Seats lock nahi ho payi'));
  };

  if (!booking.show) {
  return (
    <div className="page-container error-state">
      <div className="error-icon">⚠️</div>
      <h3>Data is missing</h3>
      <p className="movie-meta">Please select a movie and showtime before choosing seats.</p>
      <button className="action-btn" onClick={() => navigate('/')}>Go to Home Page</button>
    </div>
  );
}

  return (
    <div className="page-container">
      <h2>{booking.movie?.title}</h2>
      <div className="screen-indicator">— — — Screen This Way — — —</div>

      <div className="seat-grid">
        {seats.map((s) => (
          <button key={s.id} className={seatClass(s)} disabled={s.status !== 'AVAILABLE' && !selected.includes(s.seat.id)} onClick={() => toggleSeat(s)}>
            {s.seat.seatRow}{s.seat.seatNumber}
          </button>
        ))}
      </div>

      <div className="legend">
        <span><span className="box available"></span>Available</span>
        <span><span className="box selected"></span>Selected</span>
        <span><span className="box locked"></span>Locked</span>
        <span><span className="box booked"></span>Booked</span>
      </div>

      <div className="seat-summary">
        <p>{selected.length} seat(s) selected</p>
        <h3>Total: ₹{total}</h3>
      </div>

      <button className="action-btn full-width" onClick={handleProceed}>Proceed</button>
      {message && <p className="error-text">{message}</p>}
    </div>
  );
}

export default SeatLayout;