import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { StaffService } from '../services/staff.service';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({});
  isRegistered = false;
  isAlreadyRegistered = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private staffService: StaffService,
    private customerService: CustomerService,
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)]],
    });
  }

  register(): void {
    if (this.registrationForm && this.registrationForm.valid) {
      const registrationData = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        position: this.registrationForm.value.position,
        email: this.registrationForm.value.email,
        birthdate: this.registrationForm.value.birthdate,
        phoneNo: this.registrationForm.value.phoneNo,
        username: this.registrationForm.value.username,
        password: this.registrationForm.value.password,
      };

      if (registrationData.position === 'Admin') {
        this.adminService.registerAdmin(registrationData).subscribe({
          next: (result: boolean) => this.handleRegistrationResult(result),
          error: (error) => this.handleError(error),
        });
      } else if (registrationData.position === 'Staff') {
        this.staffService.registerStaff(registrationData).subscribe({
          next: (result: boolean) => this.handleRegistrationResult(result),
          error: (error) => this.handleError(error),
        });
      }
      else if (registrationData.position === 'Customer') {
        this.customerService.registerCustomer(registrationData).subscribe({
          next: (result: boolean) => this.handleRegistrationResult(result),
          error: (error) => this.handleError(error),
        });
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private handleRegistrationResult(result: boolean): void {
    console.log('Registration result:', result);

    if (result) {
      console.log(`${this.registrationForm.value.position} registration successful!`);
      this.isRegistered = true;
      this.isAlreadyRegistered = false;
      this.router.navigate(['/login']);
    } else {
      console.log(`${this.registrationForm.value.position} Username already exists!`);
      this.isAlreadyRegistered = true;
      this.isRegistered = false;
    }
  }

  private handleError(error: any): void {
    console.error('Error during registration:', error);
    this.isAlreadyRegistered = true;
    this.isRegistered = false;

    if (error.error) {
      console.error('Registration error message:', error.error);
    } else {
      console.error('Error during registration. Please try again.');
    }
  }
}
