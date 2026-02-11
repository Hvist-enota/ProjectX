import axios from '../api/axiosConfig';

// Отримати всіх користувачів
export const getAllUsers = async () => {
  const response = await axios.get('/users/get-all');
  return response.data;
};

// Отримати користувача за ID
export const getUserById = async (userId) => {
  const response = await axios.get(`/users/get-by-id/${userId}`);
  return response.data;
};

// Видалити користувача
export const deleteUser = async (userId) => {
  const response = await axios.delete(`/users/delete/${userId}`);
  return response.data;
};

// Оновити ролі користувача
export const updateUserRoles = async (userId, roles) => {
  const response = await axios.put(`/users/update-roles/${userId}`, roles);
  return response.data;
};

// Оновити зображення користувача
export const updateUserImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('imageFile', imageFile);
  
  const response = await axios.put(`/users/image/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Оновити інформацію користувача
export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/users/update/${userId}`, userData);
  return response.data;
};
