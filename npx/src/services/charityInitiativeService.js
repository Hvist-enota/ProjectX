import apiClient from '../api/axiosConfig';

export const getAllCharityInitiatives = async () => {
  const response = await apiClient.get('/charity-initiatives/get-all');
  return response.data;
};

export const getCharityInitiativeById = async (id) => {
  const response = await apiClient.get(`/charity-initiatives/get-by-id/${id}`);
  return response.data;
};

export const createCharityInitiative = async (formData) => {
  const response = await apiClient.post('/charity-initiatives/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateCharityInitiative = async (id, formData) => {
  const response = await apiClient.put(`/charity-initiatives/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const createCheckoutSession = async (initiativeId, initiativeTitle, amount) => {
  const response = await apiClient.post('/stripe/create-checkout-session', {
    initiativeId,
    initiativeTitle,
    amount: parseFloat(amount)
  });
  return response.data; // { sessionUrl: "https://checkout.stripe.com/..." }
};

export const deleteCharityInitiative = async (id) => {
  const response = await apiClient.delete(`/charity-initiatives/delete/${id}`);
  return response.data;
};
