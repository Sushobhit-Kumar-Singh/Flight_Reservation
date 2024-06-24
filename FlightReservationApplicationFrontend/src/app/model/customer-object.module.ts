import { CustomerFlightObject } from "./customerflight.module";

export interface CustomerObject{
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    phoneNo: string;
    username: string;
    password: string;
    customerFlights: CustomerFlightObject[];
}