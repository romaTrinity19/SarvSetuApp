import axiosClient from '../../utils/axios';

export const loginUser = async (payload: { email: string; password: string }) => {
  const res = await axiosClient.post('/auth/login', payload);
  return res.data;
};

export const registerUser = async (payload: { email: string; password: string; name: string }) => {
  const res = await axiosClient.post('/auth/register', payload);
  return res.data;
};
