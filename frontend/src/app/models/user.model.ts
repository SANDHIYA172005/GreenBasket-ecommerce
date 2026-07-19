export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** Response from POST /api/auth/login and POST /api/auth/register */
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}
