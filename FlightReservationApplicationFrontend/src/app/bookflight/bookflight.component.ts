import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-bookflight',
  templateUrl: './bookflight.component.html',
  styleUrl: './bookflight.component.css'
})

export class BookflightComponent implements OnInit{
  customerId!: number;
  flightId!: number;
  customerName!: string; 
  email!: string;
  birthDate!: string;
  phoneNumber!: string;

  bookingForm: FormGroup= new FormGroup({});
  bookingIsSuccessful = false;
  bookingIsFailed = false;
  
  constructor(private customerService: CustomerService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
    ) {
      this.bookingForm = this.fb.group({
        creditCardNumber: ['', Validators.required],
        expirationDate: ['', Validators.required],
        cvv: ['', Validators.required],
      });
    }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.customerId = this.customerService.getLoggedInCustomer()?.customerId;
    this.route.params.subscribe(params => {
      this.flightId = +params['flightId'];
    });
    this.customerService.getCustomerDetails(this.customerId)
        .subscribe(
          customerDetails => {
            this.customerName = customerDetails.firstName + ' ' + customerDetails.lastName;
            this.email = customerDetails.email;
            this.birthDate = customerDetails.birthDate;
            this.phoneNumber = customerDetails.phoneNo;
            console.log('Customer details:', customerDetails);
          },
          error => {
            console.error('Error fetching customer details:', error);
          }
        );
  }

  bookFlight(): void {
    if (this.bookingForm.valid) {
      const creditCardControl = this.bookingForm.get('creditCardNumber');
      const expirationDateControl = this.bookingForm.get('expirationDate');
      const cvvControl = this.bookingForm.get('cvv');
  
      if (creditCardControl && expirationDateControl && cvvControl) {
        const creditCardNumber = creditCardControl.value;
        const expirationDate = expirationDateControl.value;
        const cvv = cvvControl.value;
  
        this.customerService.bookFlight(this.customerId, this.flightId)
          .subscribe(
            response => {
              console.log('Flight booked successfully!', response);
              this.router.navigate(['/bookingdetails']);
              this.bookingIsSuccessful = true;
              this.bookingIsFailed = false;
            },
            error => {
              console.error('Error booking flight:', error);
              this.bookingIsSuccessful = false;
              this.bookingIsFailed = true;
            }
          );
      } else {
        console.error('Form controls are null');
      }
    }
  }
  
  
  }
