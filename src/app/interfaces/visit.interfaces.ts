import { House } from './house.interfaces';

interface Status {
  id?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  isVisible?: boolean;
}

export interface Visit {
  id?: number;
  houseId?: number;
  name?: string;
  lastname?: string;
  email?: string;
  ext?: string;
  phoneNumber?: string;
  hasVehicle?: boolean;
  scheduleDate?: string;
  entryDate?: string;
  exitDate?: string;
  plate?: string;
  status?: Status;
  house?: House;
  isActive?: boolean;
  isVisible?: boolean;
}

export interface VisitAndCount {
  visits: Visit[];
  scheduled: number;
  entered: number;
  exited: number;
  canceled: number;
}