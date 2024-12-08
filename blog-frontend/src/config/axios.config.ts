export const axiosConfig = {
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
  },
  production: {
    baseURL: '/api',
    timeout: 5000,
  }
} as const;

export const AUTH_HEADER = 'Authorization';
export const TOKEN_PREFIX = 'Bearer';
export const REFRESH_TOKEN_URL = '/refresh-token'; 