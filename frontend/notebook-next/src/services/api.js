import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy-notebook-production.up.railway.app',
  withCredentials: true
});

export default api;