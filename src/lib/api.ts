// src/lib/api.ts

import axios from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/lib/auth/token-storage';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
