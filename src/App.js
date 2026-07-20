import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import TheatreSelect from './pages/TheatreSelect';
import SeatLayout from './pages/SeatLayout';
import FoodBeverage from './pages/FoodBeverage';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Offers from './pages/Offers';
import AboutContact from './pages/AboutContact';
import Wishlist from './pages/Wishlist';
import SpinWheel from './pages/SpinWheel';

import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/movie/:movieId" element={<PrivateRoute><MovieDetail /></PrivateRoute>} />
        <Route path="/movie/:movieId/theatres" element={<PrivateRoute><TheatreSelect /></PrivateRoute>} />
        <Route path="/show/:showId/seats" element={<PrivateRoute><SeatLayout /></PrivateRoute>} />
        <Route path="/food" element={<PrivateRoute><FoodBeverage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/confirmation" element={<PrivateRoute><Confirmation /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/offers" element={<PrivateRoute><Offers /></PrivateRoute>} />
        <Route path="/about" element={<PrivateRoute><AboutContact /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/spin" element={<PrivateRoute><SpinWheel /></PrivateRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;
