import axios from 'axios';

const API_URL = process.env.API_URL || '/api';
const VARS_API_URL = process.env.VARS_API_URL || '/api';
console.log('process.env.API_URL :>> ', process);
console.log('process.env.API_URL :>> ', process.env);
console.log('process.env.API_URL :>> ', process.env.API_URL);
console.log('process.env.VARS_API_URL :>> ',process.env.VARS_API_URL);

const client = axios.create({
  baseURL: API_URL,
});

export default client;