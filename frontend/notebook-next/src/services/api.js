import axios from 'axios';

const api = axios.create({
  baseURL: 'https://notebook-deploy-production.up.railway.app',
  withCredentials: true
});

export default api;