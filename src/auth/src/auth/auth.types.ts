export interface AuthResponseUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  user: AuthResponseUser;
  accessToken: string;
}
