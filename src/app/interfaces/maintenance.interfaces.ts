import { House } from "./house.interfaces";
import { PaymentMethod } from "./payment-method.interfaces";

export interface Maintenance {
    id?: number;
    houseId?:number;
    house?:House;
    amount?: number;
    paymentDate?: string;
    startDate?: string;
    endDate?: string;
    period?: string;
    status?: string;
    paymentMethodUuid?: string;
    paymentMethod?: PaymentMethod;
    isActive?: boolean;
    isVisible?: boolean;
}

export interface MaintenanceBy {
    houses:House[],
    counts:any
}