export interface UserPayload {
  userId: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  token: string | null;
  user: UserPayload | null;
}

export interface JWTPayload extends UserPayload {
  iat: number;
  exp: number;
}
