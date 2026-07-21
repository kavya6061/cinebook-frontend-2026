import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

function Confirmation() {
  const { booking, resetBooking } = useBooking();
  const navigate = useNavigate();

  if (!booking.confirmedBooking) return <div className="page-container">No booking has been confirmed yet.</div>;

  const bookingId = booking.confirmedBooking.id;
  const seatLabels = booking.seatDetails?.map((s) => `${s.seat.seatRow}${s.seat.seatNumber}`).join(', ');

  const handleShare = async () => {
    const shareText = `🎬 My CineBook Ticket\nMovie: ${booking.movie?.title}\nSeats: ${seatLabels}\nShow: ${new Date(booking.show.showTime).toLocaleString()}\nBooking ID: #${bookingId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Movie Ticket',
          text: shareText,
        });
      } catch (err) {
        // user cancelled share, ignore
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Ticket details copied to clipboard! You can paste it anywhere to share.');
    }
  };

  const handleDone = () => {
    resetBooking();
    navigate('/');
  };

  const qrData = encodeURIComponent(
    `CineBook Ticket | Booking ID: ${bookingId} | Movie: ${booking.movie?.title} | Seats: ${seatLabels} | Show: ${new Date(booking.show.showTime).toLocaleString()}`
  );
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}`;

  return (
    <div className="page-container confirmation-page">
      <div className="success-icon">✅</div>
      <h2>Booking Confirmed!</h2>
      <p className="movie-meta">Booking ID: #{bookingId}</p>

      <div className="qr-placeholder">
        <img src={qrImageUrl} alt="Booking QR Code" className="qr-image" />
        <p className="movie-meta">Scan this at the theatre entrance to get in</p>
      </div>

      <div className="summary-card">
        <h4>{booking.movie?.title}</h4>
        <p className="movie-meta">Seats: {seatLabels}</p>
        <p className="movie-meta">{new Date(booking.show.showTime).toLocaleString()}</p>
        <h3>₹{booking.finalAmount}</h3>
      </div>

      <button className="action-btn secondary full-width" onClick={handleShare}>📤 Share Ticket</button>
      <button className="action-btn full-width" onClick={handleDone}>Back to Home</button>
    </div>
  );
}

export default Confirmation;