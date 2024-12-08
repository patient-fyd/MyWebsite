export class TokenService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
} 