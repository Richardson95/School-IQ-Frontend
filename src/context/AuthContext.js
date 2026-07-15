import React, { createContext, useContext, useState } from 'react';
import { DEMO_USERS } from '../constants/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const match = Object.values(DEMO_USERS).find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );
    if (match) {
      setUser(match);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const loginAsRole = (role) => {
    const match = DEMO_USERS[role];
    if (match) { setUser(match); return true; }
    return false;
  };

  const logout = () => setUser(null);

  const updateUser = (updates) => setUser((prev) => (prev ? { ...prev, ...updates } : prev));

  return (
    <AuthContext.Provider value={{ user, login, loginAsRole, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
