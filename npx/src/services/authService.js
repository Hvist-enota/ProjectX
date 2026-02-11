// src/services/authService.js
import apiClient from '../api/axiosConfig';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const signIn = async (email, password) => {
  const response = await apiClient.post('/account/signin', { email, password });
  return response.data;
};

export const signUp = async (email, password, name) => {
  const response = await apiClient.post('/account/signup', { email, password, name });
  return response.data;
};

// Google Sign In через Firebase
export const signInWithGoogle = async () => {
  try {
    // 1. Логін через Google з Firebase
    const result = await signInWithPopup(auth, googleProvider);
    
    // 2. Отримати ID Token від Firebase
    const idToken = await result.user.getIdToken();
    
    // 3. Відправити idToken на бекенд для верифікації та отримання JWT
    const response = await apiClient.post('/api/auth/firebase-login', { idToken });
    
    return response.data; // Повертає JWT токен від вашого бекенду
  } catch (error) {
    console.error('Google Sign In error:', error);
    throw error;
  }
};

