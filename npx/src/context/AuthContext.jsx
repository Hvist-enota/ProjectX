// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { signIn, signUp } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken && typeof storedToken === 'string') {
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Невалідний токен", err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  // Логін через API
  const login = async (email, password) => {
    try {
      const response = await signIn(email, password);
      console.log("response",response);

      if (!response || typeof response !== 'string' || !response.startsWith('ey')) {
        throw new Error('Отримано невалідний токен від сервера');
      }

      

      const newToken = response;
      localStorage.setItem('token', newToken);
      setToken(newToken);

      try {
        const decodedUser = jwtDecode(newToken);
        setUser(decodedUser);
      } catch (err) {
        console.error("JWT Decode error:", err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        return false;
      }

      return true;

    } catch (error) {
      console.error("Помилка логіну:", error);
      return false;
    }
  };

  // Реєстрація
  const register = async (email, password, name) => {
    try {
      const response = await signUp(email, password, name);
      if (!response || typeof response !== 'string' || !response.startsWith('ey')) {
        throw new Error('Отримано невалідний токен після реєстрації');
      }

      const newToken = response;
      localStorage.setItem('token', newToken);
      setToken(newToken);

      try {
        const decodedUser = jwtDecode(newToken);
        setUser(decodedUser);
      } catch (err) {
        console.error("Не вдалося декодувати токен:", err);
        return false;
      }

      return true;

    } catch (error) {
      console.error("Помилка реєстрації:", error);
      return false;
    }
  };

  // Вихід
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {!isLoading ? children : <div>Завантаження...</div>}
    </AuthContext.Provider>
  );
};