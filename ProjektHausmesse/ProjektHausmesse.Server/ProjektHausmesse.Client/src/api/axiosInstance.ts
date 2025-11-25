import axios from 'axios';
import { useNavigate } from "@tanstack/react-router"

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7257',
  timeout: 5000,

  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const navigate = useNavigate();
      return navigate({ to: '/' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
