import axios from 'axios';

const API_URL = process.env.API_URL || '/api';

const client = axios.create({
  baseURL: API_URL,
});

export default client;