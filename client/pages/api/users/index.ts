import axios, { AxiosInstance } from 'axios';

interface ApiInstance extends AxiosInstance {}

const api: ApiInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

export default api;
