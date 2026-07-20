import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const FOOD_ITEMS = [
  { id: 1, name: 'Popcorn (Large)', price: 250, category: 'Snacks' },
  { id: 2, name: 'Popcorn (Regular)', price: 180, category: 'Snacks' },
  { id: 3, name: 'Caramel Popcorn', price: 280, category: 'Snacks' },
  { id: 4, name: 'Nachos with Cheese', price: 200, category: 'Snacks' },
  { id: 5, name: 'French Fries', price: 150, category: 'Snacks' },
  { id: 6, name: 'Cheese Fries', price: 190, category: 'Snacks' },
  { id: 7, name: 'Coke (Regular)', price: 120, category: 'Beverages' },
  { id: 8, name: 'Coke (Large)', price: 160, category: 'Beverages' },
  { id: 9, name: 'Sprite (Regular)', price: 120, category: 'Beverages' },
  { id: 10, name: 'Iced Coffee', price: 180, category: 'Beverages' },
  { id: 11, name: 'Mineral Water', price: 40, category: 'Beverages' },
  { id: 12, name: 'Combo (Popcorn + Coke)', price: 350, category: 'Combos' },
  { id: 13, name: 'Combo (Nachos + Coke)', price: 320, category: 'Combos' },
  { id: 14, name: 'Family Combo (2 Popcorn + 2 Coke)', price: 600, category: 'Combos' },
  { id: 15, name: 'Chocolate Bar', price: 90, category: 'Snacks' },
  { id: 16, name: 'Samosa (2 pcs)', price: 100, category: 'Snacks' },
];

const CATEGORIES = ['Snacks', 'Beverages', 'Combos'];

function FoodBeverage() {
  const [cart, setCart] = useState({});
  const { booking, updateBooking } = useBooking();
  const navigate = useNavigate();

  const updateQty = (item, delta) => {
    setCart((prev) => {
      const qty = Math.max(0, (prev[item.id]?.qty || 0) + delta);
      return { ...prev, [item.id]: { ...item, qty } };
    });
  };

  const foodTotal = Object.values(cart).reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);

  const proceed = () => {
    const foodItems = Object.values(cart).filter((i) => i.qty > 0);
    updateBooking({ foodItems, totalAmount: booking.totalAmount + foodTotal });
    navigate('/checkout');
  };

  const skip = () => navigate('/checkout');

  return (
    <div className="page-container">
      <h2>Add Snacks & Beverages</h2>

      {CATEGORIES.map((category) => (
        <div key={category} className="food-category">
          <h3 className="food-category-title">{category}</h3>
          <div className="food-list">
            {FOOD_ITEMS.filter((item) => item.category === category).map((item) => (
              <div key={item.id} className="food-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="movie-meta">₹{item.price}</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item, -1)}>−</button>
                  <span>{cart[item.id]?.qty || 0}</span>
                  <button onClick={() => updateQty(item, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {itemCount > 0 && (
        <div className="food-summary-bar">
          <span>{itemCount} item(s)</span>
          <span>₹{foodTotal}</span>
        </div>
      )}

      <button className="action-btn full-width" onClick={proceed}>Add & Continue</button>
      <button className="action-btn secondary full-width" onClick={skip}>Skip</button>
    </div>
  );
}

export default FoodBeverage;