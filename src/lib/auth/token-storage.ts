// src/lib/auth/token-storage.ts

const ACCESS_TOKEN_KEY = 'social-media-access-token';
const AUTH_TOKEN_CHANGE_EVENT = 'auth-token-change';

const notifyTokenChange = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
};

export const tokenStorage = {
  getToken: () => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    notifyTokenChange();
  },

  clearToken: () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    notifyTokenChange();
  },
};

export { ACCESS_TOKEN_KEY, AUTH_TOKEN_CHANGE_EVENT };
