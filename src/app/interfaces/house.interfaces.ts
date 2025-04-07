import { Maintenance } from "./maintenance.interfaces";
import { Street } from "./street.interfaces";

export interface House {
  id?: number;
  name?: string;
  number?: string;
  description?: string;
  password?: string;
  qrCodeUnique?:string;
  street?:Street;
  maintenance?:Maintenance;
  streetId?:number;
  isActive?: boolean;
  isVisible?: boolean;
}
