import { FlightObject } from "./flight-object.module";

export interface StaffObject{
    staffId: number;
    firstName: string;
    lastName: string;
    position: string;
    username: string;
    password: string;
    flights: FlightObject[];
}