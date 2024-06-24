import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cancelflight',
  templateUrl: './cancelflight.component.html',
  styleUrl: './cancelflight.component.css'
})
export class CancelflightComponent implements OnInit{
  customerId!: number;
  flightId!: number;

   constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
   ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.flightId = +params['flightId'];
      this.customerId = +params['customerId'];
    });
  }

  cancelFlight(): void {
    this.customerService.cancelFlight(this.customerId, this.flightId)
      .subscribe({
        next: (response: any) => {
          console.log('Flight canceled successfully!', response);
          this.router.navigate(['/flightdetails']);
        },
        error: (error: any) => {
          console.error('Error canceling flight:', error);
          this.router.navigate(['/error']);
        }
      });
  }

}
