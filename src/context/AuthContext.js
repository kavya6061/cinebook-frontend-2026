import React, { createContext, useState, useContext } from 'react';
import { authLogin, authLogout } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sbs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (name, email, password) => {
  try {
    const res = await authLogin(name, email, password);
      const userData = {
        name: res.data.name,
        email: res.data.email,
        userId: res.data.userId,
        loginRecordId: res.data.loginRecordId,
        sessionId: 'user-' + Math.random().toString(36).slice(2),
      };
      setUser(userData);
      localStorage.setItem('sbs_user', JSON.stringify(userData));
    } catch (err) {
      const userData = { name, email, sessionId: 'user-' + Math.random().toString(36).slice(2) };
      setUser(userData);
      localStorage.setItem('sbs_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    if (user?.loginRecordId) {
      try {
        await authLogout(user.loginRecordId);
      } catch (err) {}
    }
    setUser(null);
    localStorage.removeItem('sbs_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);