import React, { useState } from 'react';

function AboutContact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Note: this is a demo form — no backend endpoint sends this yet.
    // In a real app, this would POST to a /api/contact endpoint.
    setSubmitted(true);
    setName('');
    setMessage('');
  };

  return (
    <div className="page-container">
      <h2>About CineBook</h2>
      <div className="synopsis-section">
        <p>
          CineBook is a movie ticket booking platform built to make finding and booking
          your favorite shows simple and fast. From browsing the latest releases to
          picking your perfect seat, we've got your movie night covered.
        </p>
      </div>

      <h3 className="section-title" style={{ fontSize: '20px', marginTop: '30px' }}>Contact Us</h3>
      <div className="synopsis-section">
        {submitted ? (
          <p style={{ color: '#3dff95' }}>Thanks for reaching out! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#1c0f2e', color: '#fff' }}
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="review-textarea"
              required
            />
            <button type="submit" className="action-btn full-width">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AboutContact;