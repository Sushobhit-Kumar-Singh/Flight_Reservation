import { AdminObject } from "./admin-object.module";
import { CustomerFlightObject } from "./customerflight.module";
import { StaffObject } from "./staff-object.module";

export interface FlightObject {
  flightId: number;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: Date;
  arrivalTime: Date;
  totalSeats: number;
  availableSeats: number;
  adminId: number;
  admin: AdminObject; 
  staffId: number;
  staff: StaffObject; 
  customerFlights: CustomerFlightObject[];
}
