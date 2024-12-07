import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/stores/userStore';
import { axiosConfig, AUTH_HEADER, TOKEN_PREFIX, REFRESH_TOKEN_URL } from '@/config/axios.config';
import { TokenService } from '@/services/auth/tokenService';

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const config = axiosConfig[env];

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create(config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleResponseError
    );
  }

  private handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = TokenService.getToken();
    if (token) {
      config.headers[AUTH_HEADER] = `${TOKEN_PREFIX} ${token}`;
    }
    return config;
  };

  private handleRequestError = (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  };

  private handleResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await this.refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers[AUTH_HEADER] = `${TOKEN_PREFIX} ${newToken}`;
          return this.instance(originalRequest);
        }
      } catch (err) {
        this.handleAuthError();
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  };

  private async refreshToken(): Promise<string | null> {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.instance.post(REFRESH_TOKEN_URL, {
        refresh_token: refreshToken,
      });

      if (response.data?.access_token) {
        TokenService.setToken(response.data.access_token);
        return response.data.access_token;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  private handleAuthError(): void {
    const userStore = useUserStore();
    TokenService.clearTokens();
    userStore.logout();
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const httpClient = new HttpClient();
export default httpClient.getInstance();
