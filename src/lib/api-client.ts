// src/lib/api-client.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://be-social-media-api-production.up.railway.app';

const AUTH_TOKEN_STORAGE_KEYS = ['accessToken', 'token', 'authToken'] as const;

const getAccessTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  for (const key of AUTH_TOKEN_STORAGE_KEYS) {
    const token = window.localStorage.getItem(key);

    if (token && token.trim()) {
      return token;
    }
  }

  return null;
};

const attachAuthorizationHeader = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getAccessTokenFromStorage();

  if (!token) {
    return config;
  }

  config.headers.set('Authorization', `Bearer ${token}`);

  return config;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  return attachAuthorizationHeader(config);
});

export class ApiClientError extends Error {
  public readonly status: number | null;
  public readonly responseMessage: string | null;
  public readonly responseData: unknown;

  constructor(params: {
    message: string;
    status?: number | null;
    responseMessage?: string | null;
    responseData?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.status = params.status ?? null;
    this.responseMessage = params.responseMessage ?? null;
    this.responseData = params.responseData ?? null;
  }
}

const isAxiosErrorWithResponse = (
  error: unknown
): error is AxiosError<{ message?: string; data?: unknown }> => {
  return axios.isAxiosError(error);
};

export const normalizeApiError = (error: unknown): ApiClientError => {
  if (!isAxiosErrorWithResponse(error)) {
    return new ApiClientError({
      message: 'An unexpected error occurred.',
    });
  }

  const status = error.response?.status ?? null;
  const responseMessage = error.response?.data?.message ?? null;

  if (status === 401) {
    return new ApiClientError({
      message: responseMessage ?? 'Unauthorized. Please log in again.',
      status,
      responseMessage,
      responseData: error.response?.data,
    });
  }

  if (status === 400) {
    return new ApiClientError({
      message: responseMessage ?? 'The request is invalid.',
      status,
      responseMessage,
      responseData: error.response?.data,
    });
  }

  if (status && status >= 500) {
    return new ApiClientError({
      message: responseMessage ?? 'Server error. Please try again later.',
      status,
      responseMessage,
      responseData: error.response?.data,
    });
  }

  if (error.code === 'ERR_NETWORK') {
    return new ApiClientError({
      message: 'Network error. Please check your internet connection.',
      status,
      responseMessage,
      responseData: error.response?.data,
    });
  }

  return new ApiClientError({
    message: responseMessage ?? error.message ?? 'Request failed.',
    status,
    responseMessage,
    responseData: error.response?.data,
  });
};
