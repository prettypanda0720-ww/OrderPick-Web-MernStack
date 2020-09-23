import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  // (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
  (error) => Promise.reject((error.response && error.response.data) || error.response)
);

export default axiosInstance;
