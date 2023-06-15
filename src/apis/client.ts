import axios from 'axios';

const API_URL = 'https://baophamhoang.github.io/nextjs-first-app/api' || '/nextjs-first-app/api';

const client = axios.create({
  baseURL: API_URL,
});

export default client;