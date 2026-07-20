import React from 'react';

const OFFERS = [
  { code: 'FIRST50', desc: 'Flat ₹50 off on your first booking', color: '#ff3d81' },
  { code: 'WEEKEND100', desc: '₹100 off on weekend shows above ₹500', color: '#a83dff' },
  { code: 'SNACK20', desc: '20% off on food & beverages', color: '#3dff95' },
  { code: 'FAMILY4', desc: 'Book 4+ tickets and get a free combo', color: '#ffb03d' },
  { code: 'STUDENT15', desc: '15% off with a valid student ID', color: '#3da8ff' },
];

function Offers() {
  return (
    <div className="page-container">
      <h2>Offers & Coupons</h2>
      <p className="movie-meta" style={{ marginBottom: '20px' }}>
        Apply these codes at checkout to save on your booking
      </p>

      {OFFERS.map((offer) => (
        <div key={offer.code} className="offer-card" style={{ borderColor: offer.color }}>
          <div className="offer-code" style={{ background: offer.color }}>{offer.code}</div>
          <p>{offer.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default Offers;