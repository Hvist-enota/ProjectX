// src/services/eventService.js
import apiClient from '../api/axiosConfig';

export const getAllEvents = async () => {
  const response = await apiClient.get('/event/get-all');
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await apiClient.get(`/event/get-by-id/${eventId}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await apiClient.post('/event/create', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await apiClient.put(`/event/update/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await apiClient.delete(`/event/delete/${eventId}`);
  return response.data;
};

export const searchEventsByTitle = async (title) => {
  const response = await apiClient.get('/event/search-by-title', { params: { title } });
  return response.data;
};