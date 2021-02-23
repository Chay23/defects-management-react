import axios from 'axios';
import { baseUrl } from './config'; 

const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const customAxios = axios.create({
    baseURL: baseUrl
})

customAxios.defaults.headers.common['Authorization'] = `Bearer ${getCookie('token')}`

export default customAxios;