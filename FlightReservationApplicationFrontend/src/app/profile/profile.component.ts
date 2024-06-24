import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  loggedInCustomer: any | null = null;
  customerDetails: any;

  constructor(
    private customerService: CustomerService, 
    private router: Router,
    private location: Location
    ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loggedInCustomer = this.customerService.getLoggedInCustomer();

    if (this.loggedInCustomer) {
      this.customerService.getCustomerDetails(this.loggedInCustomer.customerId).subscribe(
        details => {
          this.customerDetails = details;
          console.log('Customer Details:', details);
        },
        error => {
          console.error('Error fetching customer details:', error);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

}
