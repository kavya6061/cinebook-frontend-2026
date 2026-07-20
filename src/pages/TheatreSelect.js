import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowsByMovie } from '../api';
import { useBooking } from '../context/BookingContext';

function getNextDates() {
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

const TIME_FILTERS = ['Morning', 'Afternoon', 'Evening', 'Night'];

function getTimeSlot(hour) {
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
}

function TheatreSelect() {
  const { movieId } = useParams();
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeTimeFilter, setActiveTimeFilter] = useState(null);
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const dates = getNextDates();

  useEffect(() => {
    getShowsByMovie(movieId).then((res) => setShows(res.data));
  }, [movieId]);

  const toggleTimeFilter = (filter) => {
    setActiveTimeFilter((prev) => (prev === filter ? null : filter));
  };

  const filteredShows = activeTimeFilter
    ? shows.filter((s) => getTimeSlot(new Date(s.showTime).getHours()) === activeTimeFilter)
    : shows;

  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreName = show.screen?.theatre?.name || 'Unknown Theatre';
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(show);
    return acc;
  }, {});

  const handleSelectShow = (show) => {
    updateBooking({ show });
    navigate(`/show/${show.id}/seats`);
  };

  return (
    <div className="page-container">
      <h2>Select Date & Showtime</h2>

      <div className="date-picker">
        {dates.map((d, i) => (
          <button key={i} className={`date-chip ${selectedDate === i ? 'active' : ''}`} onClick={() => setSelectedDate(i)}>
            <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div>{d.getDate()}</div>
          </button>
        ))}
      </div>

      <div className="filter-row">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter}
            className={`filter-chip clickable ${activeTimeFilter === filter ? 'active' : ''}`}
            onClick={() => toggleTimeFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {Object.keys(showsByTheatre).length === 0 && (
        <p className="empty-text">
          {activeTimeFilter
            ? `No shows found for ${activeTimeFilter}. Try clearing the filter.`
            : 'No shows found for this movie yet.'}
        </p>
      )}

      {Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
        <div key={theatreName} className="theatre-card">
          <h4>{theatreName}</h4>
          <div className="show-times">
            {theatreShows.map((show) => (
              <button key={show.id} className="showtime-btn" onClick={() => handleSelectShow(show)}>
                {new Date(show.showTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TheatreSelect;