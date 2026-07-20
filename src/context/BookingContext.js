import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    movie: null,
    show: null,
    selectedSeats: [],
    seatDetails: [],
    foodItems: [],
    totalAmount: 0,
  });

  const updateBooking = (data) => {
    setBooking((prev) => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBooking({
      movie: null,
      show: null,
      selectedSeats: [],
      seatDetails: [],
      foodItems: [],
      totalAmount: 0,
    });
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);