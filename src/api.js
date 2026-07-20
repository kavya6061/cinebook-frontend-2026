import axios from 'axios';

const API_BASE = 'https://seat-booking-backed-production.up.railway.app/api';

// Theatre / Movie / Show / Seat APIs
export const getMovies = () => axios.get(`${API_BASE}/movies`);
export const getMovie = (id) => axios.get(`${API_BASE}/movies/${id}`);
export const getShowsByMovie = (movieId) => axios.get(`${API_BASE}/shows/movie/${movieId}`);
export const getTheatres = () => axios.get(`${API_BASE}/theatres`);
export const getSeatStatus = (showId) => axios.get(`${API_BASE}/seats/show/${showId}/status`);

// Booking APIs
export const lockSeats = (showId, seatIds, sessionId) =>
  axios.post(`${API_BASE}/bookings/lock-seats`, { showId, seatIds, sessionId });

export const releaseSeats = (showId, seatIds, sessionId) =>
  axios.post(`${API_BASE}/bookings/release-seats`, { showId, seatIds, sessionId });

export const confirmBooking = (showId, seatIds, sessionId, userName, userEmail) =>
  axios.post(`${API_BASE}/bookings/confirm`, { showId, seatIds, sessionId, userName, userEmail });

export const getBooking = (id) => axios.get(`${API_BASE}/bookings/${id}`);

export const getUserBookings = (email) => axios.get(`${API_BASE}/bookings/user/${email}`);

// Auth APIs
export const authLogin = (name, email, password) =>
  axios.post(`${API_BASE}/auth/login`, { name, email, password });

export const authLogout = (loginRecordId) => axios.post(`${API_BASE}/auth/logout/${loginRecordId}`);

export const getAuthStats = () => axios.get(`${API_BASE}/auth/stats`);

export const getLoginHistory = () => axios.get(`${API_BASE}/auth/history`);