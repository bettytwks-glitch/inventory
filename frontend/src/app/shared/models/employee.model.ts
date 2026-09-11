export interface LoginRequest {
  employeeId: string;
  password: string;
}

export interface RegisterRequest {
  employeeId: string;
  name: string;
  department: string;
  adAccount: string;
  email?: string;
  site?: string;
}

export interface AuthResponse {
  token: string;
  employeeId: string;
  name: string;
  department: string;
  site?: string;
  role: string;
  mustChangePassword: boolean;
}

export interface CurrentUser {
  employeeId: string;
  name: string;
  department: string;
  site?: string;
  role: string;
  mustChangePassword: boolean;
}