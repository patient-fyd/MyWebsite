export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  message: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data: T;
} 