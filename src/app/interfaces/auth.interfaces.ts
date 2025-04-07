import { House } from "./house.interfaces";
import { Role } from "./role.interfaces";

export interface AuthResponse {
    ok:         boolean;
    login?:     boolean;
    id?:        number;
    access_token: string;
    username?:  string;
    token?:     string;
    msg?:       string;
    uid?:        number;
    user?:       string;
}

export interface LoginResponse {
  user?: any;
  access_token: string;
  refresh_token:string;
}

export interface UserLogged {
  uuid?:string;
  username?: string;
  role?: Role;
  house?:House;
  isFirstTime?: boolean;
  requiresPasswordReset?: boolean;
  name?:string;
  lastname?:string;
  qrCodeUnique?:string;
  profileImage?:string;
  email?:string;
  phone?:string;
  status?:boolean;
}

export interface UserAuth {
    uuid:         string;
    username:   string;
}

export interface Login {
  username:   string;
  password:   string;
}

export interface CheckTokenResponse {
  user: UserAuth;
  access_token: string;
}