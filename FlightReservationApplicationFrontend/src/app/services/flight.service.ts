import {  Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FlightObject } from '../model/flight-object.module';
import { CustomerFlightObject } from '../model/customerflight.module';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'https://localhost:7206/api/flights';


  constructor(private http: HttpClient) {}
  
  getAllFlights(): Observable<FlightObject[]> {
    const flights=this.http.get<FlightObject[]>(`${this.apiUrl}`);
    return flights;
  }

  getFlightById(flightId: number): Observable<Object> {
    return this.http.get<FlightObject>(`${this.apiUrl}/${flightId}`);
  }

  addFlight(flight: FlightObject): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, flight);
  }

  updateFlight(flightId: number, flight: FlightObject): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${flightId}`, flight);
  }

  deleteFlight(flightId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${flightId}`);
  }

  cancelBooking(request: CustomerFlightObject): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel-booking`, request);
  }

  cancelFlight(flightId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cancel-flight/${flightId}`);
  }
}
