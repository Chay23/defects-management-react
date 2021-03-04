import axios from 'axios';
import { baseUrl } from './config';
import { getCookie } from './components/GetCookie/GetCookie';

const customAxios = axios.create({
  baseURL: baseUrl,
});

customAxios.defaults.headers.common['Authorization'] = `Bearer ${getCookie(
  'token'
)}`;

export default customAxios;
