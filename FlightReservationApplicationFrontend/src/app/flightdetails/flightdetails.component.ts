import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { StaffService } from '../services/staff.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-flightdetails',
  templateUrl: './flightdetails.component.html',
  styleUrl: './flightdetails.component.css'
})
export class FlightdetailsComponent implements OnInit {
  customerId: number | null = null;
  adminId: number | null = null;  
  staffId: number | null = null;  
  flights: any[] = [];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private adminService: AdminService,
    private staffService: StaffService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
  
  ngOnInit(): void {
    this.customerId = this.customerService.getCustomerId();
    this.adminId = this.adminService.getAdminId();
    this.staffId = this.staffService.getStaffId();
    this.loadCustomerFlights();
  }

  loadCustomerFlights(): void {
    console.log(this.staffId);
    const loggedInCustomerId = this.customerService.getLoggedInCustomer()?.customerId;

    if (this.customerId !== null) {
      this.customerService.getCustomerFlights(loggedInCustomerId)
        .subscribe({
          next: (data: any) => {
            this.flights = data.$values.map((flight: any) => ({ ...flight, customerId: loggedInCustomerId }));
            console.log('Fetched flights', this.flights);
          },
          error: (error: any) => {
            console.error('Error fetching flights', error);
          }
        });
      } else if (this.adminId !== null || this.staffId !== null) {
        this.customerService.getAllCustomerFlights()
          .subscribe({
            next: (data: any) => {
              if (data && data.$values) {
                this.flights = data.$values.map((flight: any) => {
                  const customerId = flight.customerFlights?.$values?.map((cf: any) => cf.customerId) || [];
                  const formattedCustomerIds = customerId.length > 0 ? customerId.join(', ') : 'unknown';
      
                  return {
                    ...flight,
                    customerId: formattedCustomerIds
                  };
                });   

                console.log('Fetched flights', this.flights);
              } else {
                console.error('Invalid API response structure');
              }
            },
            error: (error: any) => {
              console.error('Error fetching all customers\' flights', error);
            }
          });
      }
    }

  bookFlight(flightId: number): void {
    this.router.navigate(['/bookflight', flightId]);
  }

   cancelFlight(customerId: number, flightId: number): void {
    this.router.navigate(['/cancelflight', customerId, flightId ]);
  }

}
