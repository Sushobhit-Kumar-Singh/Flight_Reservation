import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CustomerObject } from '../model/customer-object.module';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'https://localhost:7206/api/Customers'; 
  private loggedInCustomer: any | null = null;
  private customerId: number | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    setCustomerId(customerId: number | null): void {
      this.customerId = customerId;
    }

    getCustomerId(): number | null {
      return this.customerId;
    }

  registerCustomer(customer: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/register`, customer);
  }

  loginCustomer(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response: any) => {
          this.loggedInCustomer = response;
          localStorage.setItem('customerId', response.customerId.toString()??"default value"); 
          return response;
        })
      );
  }

  logout(): void {
    this.loggedInCustomer = null;
    localStorage.removeItem('customerId');
    this.router.navigate(['/']);
    }

    getLoggedInCustomer(): any | null {
      if (isPlatformBrowser(this.platformId)) {
        const storedCustomerId = localStorage.getItem('customerId');
        this.loggedInCustomer = storedCustomerId ? { customerId: +storedCustomerId } : null;
        return this.loggedInCustomer;
      }
      return null;  
    }

    

  getCustomerDetails(customerId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/${customerId}/details`);
  }

  bookFlight(customerId: number, flightId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${customerId}/book-flight/${flightId}`, {});
  }

  cancelBooking(customerId: number, flightId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${customerId}/cancel-booking/${flightId}`);
  }

  cancelFlight(customerId: number, flightId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${customerId}/cancel-flight/${flightId}`);
  }

  getAllCustomerBookings(): Observable<any> {
    const url = `${this.baseUrl}/all-customers-bookings`;
    return this.http.get<any[]>(url);  
  }

  getCustomerBookings(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${customerId}/bookings`);
  }

  getCustomerFlights(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${customerId}/flights`);
  }

  getAllCustomerFlights(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-customers-flights`);
  }

}
