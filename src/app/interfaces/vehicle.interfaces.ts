import { House } from './house.interfaces';

export interface Vehicle {
  id: number;
  brand?: string;
  color?: string;
  model?: string;
  modelYear?: string;
  plate?: string;
  house?: House;
  isActive?: boolean;
  isVisible?: boolean;
}
