import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy-notebook.railway.internal'
});

export default api;