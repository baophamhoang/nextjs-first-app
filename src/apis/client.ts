import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
});

export default client;