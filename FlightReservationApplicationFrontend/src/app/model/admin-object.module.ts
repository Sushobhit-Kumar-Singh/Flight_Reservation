import { FlightObject } from "./flight-object.module";

export interface AdminObject{
    adminId: number;
    username: string;
    password: string;
    flights: FlightObject[];
}