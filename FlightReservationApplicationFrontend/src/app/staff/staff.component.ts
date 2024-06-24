import { Component, OnInit } from '@angular/core';
import { FlightObject } from '../model/flight-object.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FlightService } from '../services/flight.service';
import { StaffService } from '../services/staff.service';
import { NotificationService } from '../services/notifications.service';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  flights: FlightObject[] = [];
  flightForm: FormGroup = this.fb.group({});

  isEditing = false;
  selectedFlightId: number | undefined;
  loggedInStaff: any | null = null;
  loggedInAdmin: any | null = null;

  constructor(
    private flightService: FlightService,
    private fb: FormBuilder,
    private staffService: StaffService,
    private notificationService: NotificationService,
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.loggedInStaff = this.staffService.getLoggedInStaff();
    if (!this.loggedInStaff) {
      this.router.navigate(['/login']);
      return;
    }
    this.initForm();
    this.loadAllFlights();
  }

  initForm(): void {
    const totalSeatsControl = this.fb.control(null, [Validators.required, Validators.min(1)]);
    const availableSeatsControl = this.fb.control(null, [Validators.required, Validators.min(0), this.availableSeatsValidator(totalSeatsControl)]);

    this.flightForm = this.fb.group({
      flightNumber: ['', [Validators.required]],
      departureCity: ['', [Validators.required]],
      arrivalCity: ['', [Validators.required]],
      departureTime: [null, [Validators.required]],
      arrivalTime: [null, [Validators.required]],
       totalSeats: totalSeatsControl,
    availableSeats: availableSeatsControl,
      adminId: this.loggedInAdmin?.adminId || 41,
      admin: this.loggedInAdmin
        ? {
            adminId: this.loggedInAdmin.adminId,
            username: this.loggedInAdmin.username || '',
            password: this.loggedInAdmin.password || '',
            flights: this.loggedInAdmin.flights,
          }
        : null,
      staffId: this.loggedInStaff?.staffId || null,
      staff: this.loggedInStaff
      ?{
        staffId: this.loggedInStaff.staffId,
        firstName: this.loggedInStaff.firstName || '',
        lastName: this.loggedInStaff.lastName || '',
        position: this.loggedInStaff.position || '',
        username: this.loggedInStaff.username || '',
        password: this.loggedInStaff.password || '',
        flights: this.loggedInStaff.flights,
      }
      : null,
      customerFlights: [null],
    }, {
      validators: this.availableSeatsValidator(totalSeatsControl),
    });

    if (!this.loggedInStaff) {
      this.flightForm.disable();
    }
  }

  availableSeatsValidator(totalSeatsControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const totalSeats = totalSeatsControl.value;
      const availableSeats = control.value;
  
      if (totalSeats !== null && availableSeats !== null && availableSeats > totalSeats) {
        return { 'invalidSeats': true, 'message': 'Available seats cannot be greater than total seats.' };
      }
  
      return null;
    };
  }

  loadAllFlights(): void {
    this.flightService.getAllFlights()
      .pipe(
        catchError((error) => {
          console.error('Error fetching flights', error);
          return [];
        }),
        finalize(() => {
          console.log('API request completed');
        })
      )
      .subscribe((data: any) => {
        if (data && data.$values) {
          this.flights = data.$values;
          console.log('Fetched flights', this.flights);
        } else {
          console.error('Invalid API response structure');
        }
      });
  }

  editFlight(flight: FlightObject): void {
    this.isEditing = true;
    this.selectedFlightId = flight.flightId;
  
    if (this.flightForm) {
      this.flightForm.patchValue({
        flightNumber: flight.flightNumber,
        departureCity: flight.departureCity,
        arrivalCity: flight.arrivalCity,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        totalSeats: flight.totalSeats,
        availableSeats: flight.availableSeats,
      });
    }
  }
    updateFlight(): void {
    if (!this.loggedInStaff || this.selectedFlightId === undefined) {
      console.log('No logged-in staff. Cannot submit the form.');
      return;
    }
  
    if (this.flightForm ) {
      const updatedFlight = this.flightForm.value as FlightObject;
  
      this.flightService.updateFlight(this.selectedFlightId, updatedFlight)
        .pipe(
          catchError((error) => {
            console.log('Error updating flight:', error);
            this.notificationService.showError('Failed to update flight.');
            return [];
          }),
          finalize(() => {
            this.loadAllFlights();
            this.resetForm();
          })
        )
        .subscribe();
    }
  }

  deleteFlight(flightId: number): void {
    this.flightService
      .deleteFlight(flightId)
      .pipe(
        catchError(() => {
          this.notificationService.showError('Failed to delete flight.');
          return [];
        }),
        finalize(() => {
          this.loadAllFlights();
        })
      )
      .subscribe();
  }

  onSubmit(): void {
    if (!this.loggedInStaff) {
      this.notificationService.showError('No logged-in staff. Cannot submit the form.');
      return;
    }

    if (this.flightForm) {
      const flightObject = this.flightForm.value as FlightObject;

      if (this.isEditing && this.selectedFlightId !== undefined) {
        this.flightService
          .updateFlight(this.selectedFlightId, flightObject)
          .pipe(
            catchError(() => {
              this.notificationService.showError('Failed to update flight.');
              return [];
            }),
            finalize(() => {
              this.loadAllFlights();
              this.resetForm();
            })
          )
          .subscribe();
      } else {
        flightObject.staffId = this.loggedInStaff?.staffId || 0;
        this.flightService
          .addFlight(flightObject)
          .pipe(
            catchError(() => {
              this.notificationService.showError('Failed to add flight.');
              return [];
            }),
            finalize(() => {
              this.loadAllFlights();
              this.resetForm();
            })
          )
          .subscribe();
      }
    }
  }

  resetForm(): void {
    if (this.flightForm) {
      this.flightForm.reset();
    }
    this.isEditing = false;
    this.selectedFlightId = undefined;
  }

  formatDateTime(dateTime: Date | string | undefined): string {
    if (!dateTime) {
      return 'N/A';
    }

    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
}

