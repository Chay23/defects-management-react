import axios from 'axios';
import { baseUrl } from './config';
import { getCookie } from './components/GetCookie/GetCookie';

const customAxios = axios.create({
  baseURL: baseUrl,
});

customAxios.interceptors.request.use(
  config => {
    const token = getCookie('token');
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

export default customAxios;
