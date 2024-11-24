import axios from 'axios';

const API_URL = process.env.API_URL;
const IMAGE_API_URL = process.env.IMAGE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

export const iapi = axios.create({
  baseURL: IMAGE_API_URL,
});