import { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // later we could fetch user info if needed
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (credentials) => {
    console.debug('login called with', credentials);
    const res = await API.post('/user/login', credentials);
    console.debug('login response', res.data);
    setToken(res.data.token);
    // backend currently returns id and email, not full user object
    setUser({ id: res.data.userId, email: res.data.email });
    return res;
  };

  const register = async (userInfo) => {
    console.debug('register called with', userInfo);
    const res = await API.post('/user/register', userInfo);
    console.debug('register response', res.data);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
