// src/services/authService.js
import apiClient from '../api/axiosConfig';

export const signIn = async (email, password) => {
  const response = await apiClient.post('/account/signin', { email, password });
  return response.data;
};

export const signUp = async (email, password, name) => {
  const response = await apiClient.post('/account/signup', { email, password, name });
  return response.data;
};

