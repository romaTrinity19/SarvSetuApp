import axios from 'axios';
import Constants from 'expo-constants';

const HOST_API_KEY ='https://sarvsetu.trinitycrm.in';
const CLIENT ='sarvsetu';

const axiosInstance = axios.create({
  baseURL: HOST_API_KEY,
  headers: {
    'x-client-id': CLIENT,
    'Content-Type': 'application/json',
  },
});

// // Auto-attach token if available
// axiosInstance.interceptors.request.use((config) => {
//   const token = globalThis.token; // set token globally after login if needed
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// Handle errors
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('API error:', error.response || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
