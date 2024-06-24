import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AdminService } from '../services/admin.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.component.html',
  styleUrl: './bookingdetails.component.css'
})
export class BookingdetailsComponent implements OnInit{
  customerId: number | null = null;
  adminId: number | null = null;
  bookings: any[]=[];
  flights: any[] = [];
  customerDetails: any;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private adminService: AdminService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
  
  ngOnInit(): void {
    this.customerId = this.customerService.getCustomerId();
    this.adminId = this.adminService.getAdminId();
    this.loadCustomerBookings();
  }

  loadCustomerBookings(): void {
    console.log('Customer ID:', this.customerId);
    console.log('Admin ID:', this.adminId);

    if (this.customerId !== null) {
      console.log('CUSTOMER');
      this.customerService.getCustomerBookings(this.customerId)
        .subscribe({
          next: (data: any) => {
            this.bookings = data.$values;
            console.log('Fetched bookings', this.bookings);
          },
          error: (error: any) => {
            console.error('Error fetching bookings', error);
          }
        });
    } else if (this.adminId !== null) {
      console.log('ADMIN');
      this.customerService.getAllCustomerBookings()
        .subscribe({
          next: (data: any) => {
            if (data && data.$values) {
              this.bookings = data.$values;
              console.log('Fetched bookings', this.bookings);
            } else {
              console.error('Invalid API response structure');
            }
          },
          error: (error: any) => {
            console.error('Error fetching all customers\' bookings', error);
          }
        });
    }
  }

  cancelBooking(bookingId: number, flightId: number): void {
    if (this.customerId !== null) {
      this.customerService.cancelBooking(this.customerId, flightId)
        .subscribe({
          next: (response: any) => {
            console.log('Booking canceled successfully!', response);
            this.loadCustomerBookings();
          },
          error: (error: any) => {
            console.error('Error canceling booking:', error);
          }
        });
    } else if (this.adminId !== null) {
      console.log('All Bookings:', this.bookings);
  
      const booking = this.bookings.find(booking => booking.customerId === bookingId);
  
      console.log('Booking ID:', bookingId); 
      console.log('Booking:', booking); 
  
      if (booking) {
        const adminCustomerId = booking.customerId;
        console.log('Admin Customer ID:', adminCustomerId);
        if (adminCustomerId !== null) {
          this.customerService.cancelBooking(adminCustomerId, flightId)
            .subscribe({
              next: (response: any) => {
                console.log('Booking canceled successfully!', response);
                this.loadCustomerBookings();
              },
              error: (error: any) => {
                console.error('Error canceling booking:', error);
              }
            });
        } else {
          console.error('customerId is null. Cannot cancel booking.');
        }
      } else {
        console.error('Booking not found for ID:', bookingId);
      }
    } else {
      console.error('adminId is null. Cannot cancel booking.');
    }
  }
}
