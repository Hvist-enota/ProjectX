import apiClient from '../api/axiosConfig';

export const getAboutImages = async () => {
  const response = await apiClient.get('/about-us/get-all');
  return response.data;
};

export const uploadImage = async (formData) => {
  const response = await apiClient.post('/about-us/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};