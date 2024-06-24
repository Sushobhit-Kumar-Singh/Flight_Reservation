import { CustomerObject } from "./customer-object.module";
import { FlightObject } from "./flight-object.module";

export interface CustomerFlightObject{
    customerFlightId:number,
    customerId:number,
    customer:CustomerObject,
    flightId:number,
    flight:FlightObject
}