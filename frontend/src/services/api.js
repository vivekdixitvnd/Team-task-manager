import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: 'https://team-task-manager-2-ng7p.onrender.com/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;
