import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy-notebook-production.up.railway.app'
});

export default api;