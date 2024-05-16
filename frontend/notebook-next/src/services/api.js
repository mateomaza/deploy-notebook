import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy-notebook-production.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;