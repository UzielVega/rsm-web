import { House } from './house.interfaces';
import { Vehicle } from './vehicle.interfaces';

export interface Tag {
  id?: number;
  code?: string;
  house?: House;
  vehicle?: Vehicle;
  isActive?: boolean;
  isVisible?: boolean;
}
