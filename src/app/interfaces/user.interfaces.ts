import { Role } from './role.interfaces';

export interface User {
  uuid?: string;
  name?: string;
  lastname?: string;
  email?: string;
  profileImage?: string;
  gender?: string;
  birthday?: Date;
  ext?: string;
  phoneNumber?: string;
  username?: string;
  role?: Role;
  isActive?: boolean;
  isVisible?: boolean;
}
