import { House } from './house.interfaces';

export interface Resident {
  uuid?: string;
  name?: string;
  lastname?: string;
  ext?: string;
  phoneNumber?: string;
  email?: string;
  houseId?: number;
  qrCodeUnique?:string;
  house?: House;
  description?: string;
  isActive?: boolean;
  isVisible?: boolean;
  isFirstTime?: boolean;
}
