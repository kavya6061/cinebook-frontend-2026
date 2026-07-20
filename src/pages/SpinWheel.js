import React, { useState } from 'react';

const PRIZES = [
  { label: '10% OFF', code: 'SPIN10' },
  { label: '₹50 OFF', code: 'SPIN50' },
  { label: 'Free Popcorn', code: 'SPINPOP' },
  { label: 'Try Again', code: null },
  { label: '20% OFF', code: 'SPIN20' },
  { label: '₹100 OFF', code: 'SPIN100' },
  { label: 'Try Again', code: null },
  { label: 'Free Drink', code: 'SPINDRINK' },
];

function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSpunToday, setHasSpunToday] = useState(() => {
    return localStorage.getItem('sbs_spin_date') === new Date().toDateString();
  });

  const handleSpin = () => {
    if (spinning || hasSpunToday) return;
    setSpinning(true);
    setResult(null);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = 360 * 5 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult(PRIZES[prizeIndex]);
      localStorage.setItem('sbs_spin_date', new Date().toDateString());
      setHasSpunToday(true);
    }, 4000);
  };

  return (
    <div className="page-container spin-page">
      <h2>🎡 Spin & Win</h2>
      <p className="movie-meta" style={{ marginBottom: '20px' }}>
        Spin once a day for a chance to win discounts and freebies!
      </p>

      <div className="wheel-container">
        <div className="wheel-pointer">▼</div>
        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {PRIZES.map((prize, i) => (
            <div
              key={i}
              className="wheel-segment"
              style={{
                transform: `rotate(${(360 / PRIZES.length) * i}deg)`,
                background: i % 2 === 0 ? '#ff3d81' : '#a83dff',
              }}
            >
              <span>{prize.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="action-btn full-width"
        onClick={handleSpin}
        disabled={spinning || hasSpunToday}
      >
        {hasSpunToday ? 'Come back tomorrow!' : spinning ? 'Spinning...' : 'Spin Now'}
      </button>

      {result && (
        <div className="spin-result">
          {result.code ? (
            <>
              <h3>🎉 You won: {result.label}!</h3>
              <p className="movie-meta">Use code <strong>{result.code}</strong> at checkout</p>
            </>
          ) : (
            <h3>Better luck next time!</h3>
          )}
        </div>
      )}
    </div>
  );
}

export default SpinWheel;