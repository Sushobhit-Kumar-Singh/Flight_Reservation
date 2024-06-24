import { Component,OnInit } from '@angular/core';
import { FlightObject } from '../model/flight-object.module';
import { FlightService } from '../services/flight.service';
import { Observable } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{
  public flights: FlightObject[] = [];
  public searchTerm: string = '';
  public filteredFlights: FlightObject[] = [];

  constructor(private flightService: FlightService,
              private customerService:CustomerService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location
             ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loadAllFlights(); 

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.filterFlights();
    });
  }

  loadAllFlights(): void {
    this.fetchFlights(this.flightService.getAllFlights());
  }

  filterFlights(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredFlights = [...this.flights];
    } else {
      this.filteredFlights = this.flights.filter(flight =>
        this.includesSearchTerm(flight)
      );
    }
  }

  private includesSearchTerm(flight: FlightObject): boolean {
    const searchTermLowerCase = this.searchTerm.toLowerCase();
    return (
      flight.flightNumber.toLowerCase().includes(searchTermLowerCase) ||
      flight.departureCity.toLowerCase().includes(searchTermLowerCase) ||
      flight.arrivalCity.toLowerCase().includes(searchTermLowerCase) 
    );
  }


  getLoggedInCustomerId(): number | null {
    const loggedInCustomer = this.customerService.getLoggedInCustomer();
    return loggedInCustomer ? loggedInCustomer.customerId : null;
  }

  private fetchFlights(flights$: Observable<any>): void {
    const observer = {
      next: (data: any) => {
        if (data && data.$values) {
          this.flights = data.$values;
          console.log('Fetched flights', this.flights);
        } else {
          console.error('Invalid API response structure');
        }
      },
      error: (error: any) => {
        console.error('Error fetching flights', error);
      },
      complete: () => {
        console.log('API request completed');
      }
    };

    console.log('Fetching flights...');
    flights$.subscribe(observer);
  }

  formatDateTime(dateTime: Date | string | undefined): string {
    if (!dateTime) {
      return 'N/A';
    }

    const formattedDateTime = (dateTime instanceof Date)
      ? dateTime.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      : new Date(dateTime).toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });

    return formattedDateTime;
  }

  bookFlight(flightId: number): void {
    this.router.navigate(['/bookflight', flightId]);
  }
}
