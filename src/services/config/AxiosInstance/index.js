import axios from 'axios';
export const BASE_URL = 'http://213.199.35.222:3000/'
export const AI_BASE_URL = 'http://213.199.35.222:8000/'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });
  
  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
      
        return error.response;
      } else if (error.request) {
      } else {
      }
      return Promise.reject(error);
    },
  );

 