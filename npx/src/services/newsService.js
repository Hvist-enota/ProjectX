// src/services/newsService.js
import apiClient from '../api/axiosConfig';

export const getAllNews = async () => {
  const response = await apiClient.get('/news/get-all');
  console.log(response);
  
  return response.data;
};

export const getNewsById = async (newsId) => {
  const response = await apiClient.get(`/news/get-by-id/${newsId}`);
  return response.data;
};

export const createNews = async (newsData) => {
    const payload = {
      ...newsData,
      publishDate: new Date(newsData.publishDate).toISOString()
    };
    const response = await apiClient.post('/news/create', payload);
    return response.data;
  };
  
  export const updateNews = async (newsId, newsData) => {
    const payload = {
      ...newsData,
      publishDate: new Date(newsData.publishDate).toISOString()
    };
    const response = await apiClient.put(`/news/update/${newsId}`, payload);
    return response.data;
  };

export const deleteNews = async (newsId) => {
  const response = await apiClient.delete(`/news/delete/${newsId}`);
  return response.data;
};

export const searchNewsByTitle = async (title) => {
  const response = await apiClient.get('/news/search-by-title', { params: { title } });
  return response.data;
};