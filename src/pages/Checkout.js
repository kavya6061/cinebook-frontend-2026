import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

function Checkout() {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { booking, updateBooking } = useBooking();
  const navigate = useNavigate();

  const foodAmount = booking.foodItems?.reduce((s, i) => s + i.price * i.qty, 0) || 0;
  const ticketAmount = booking.totalAmount - foodAmount;
  const gst = Math.round((ticketAmount + foodAmount) * 0.18);
  const convenienceFee = 30;
  const grandTotal = ticketAmount + foodAmount + gst + convenienceFee - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST50') setDiscount(50);
    else setError('Invalid promo code');
  };

  const handlePay = () => {
    setProcessing(true);
    setError('');
    confirmBooking(booking.show.id, booking.selectedSeats, user.sessionId, user.name, user.email)
      .then((res) => {
        updateBooking({ confirmedBooking: res.data.data, finalAmount: grandTotal });
        navigate('/confirmation');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Payment fail ho gaya, dobara try karo');
        setProcessing(false);
      });
  };

  if (!booking.show) return <div className="page-container">Booking data missing. Home pe wapas jao.</div>;

  return (
    <div className="page-container">
      <h2>Checkout</h2>
      <div className="summary-card">
        <h4>{booking.movie?.title}</h4>
        <p className="movie-meta">{booking.seatDetails?.map((s) => `${s.seat.seatRow}${s.seat.seatNumber}`).join(', ')}</p>
        <p className="movie-meta">{new Date(booking.show.showTime).toLocaleString()}</p>
      </div>

      <div className="price-breakup">
        <div className="price-row"><span>Ticket Price</span><span>₹{ticketAmount}</span></div>
        {foodAmount > 0 && <div className="price-row"><span>Food & Beverages</span><span>₹{foodAmount}</span></div>}
        <div className="price-row"><span>GST (18%)</span><span>₹{gst}</span></div>
        <div className="price-row"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
        {discount > 0 && <div className="price-row discount"><span>Discount</span><span>−₹{discount}</span></div>}
        <div className="price-row total-row"><span>Total</span><span>₹{grandTotal}</span></div>
      </div>

      <div className="promo-box">
        <input placeholder="Promo Code (try FIRST50)" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
        <button className="action-btn secondary" onClick={applyPromo}>Apply</button>
      </div>

      <h4>Payment Method</h4>
      <div className="payment-options">
        {['upi', 'card', 'netbanking', 'wallet'].map((method) => (
          <button key={method} className={`payment-chip ${paymentMethod === method ? 'active' : ''}`} onClick={() => setPaymentMethod(method)}>
            {method.toUpperCase()}
          </button>
        ))}
      </div>

      <button className="action-btn full-width" onClick={handlePay} disabled={processing}>
        {processing ? 'Processing...' : `Pay ₹${grandTotal}`}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Checkout;