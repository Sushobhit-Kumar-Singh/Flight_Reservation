import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { StaffService } from '../services/staff.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserType } from '../model/auth.enum';
import { CustomerService } from '../services/customer.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  isLoginFailed = false;
  isLoginSuccessful = false;
  isLoggingIn = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private staffService: StaffService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    if (this.authService.isAdminOrStaffOrCustomerLoggedIn()) {
      this.router.navigate(['/welcome']);
    }else
    {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]*$/)]]
    });
  }
  }

  onSubmit(): void {
    if (this.loginForm && this.loginForm.valid) {
      const credentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
  
      this.isLoggingIn = true;
      
      let userType: string;

      if (this.isAdmin(credentials.username)) {
        userType = 'admin';
      } else if (this.isStaff(credentials.username)) {
        userType = 'staff';
      } else {
        userType = 'customer';
      }

      this.authService.login(credentials, userType).subscribe({
        next: (response: any) => this.handleLoginSuccess(response, userType),
        error: (error) => this.handleLoginError(error),
        complete: () => this.isLoggingIn = false
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private isAdmin(username: string): boolean {
    return username.startsWith(UserType.Admin);
  }

  private isStaff(username: string): boolean {
    return username.startsWith(UserType.Staff);
  }
  
  private handleLoginSuccess(response: any, userType: string): void {
    console.log(`${userType} login successful!`, response);
    this.isLoginSuccessful = true;
    this.authService.setLoggedInUser(response, userType); 
    if (userType === 'customer') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate([`/${userType}`]);
    }
  }
  
  
  private handleLoginError(error: any): void {
    console.error('Error during login:', error);
    this.isLoginFailed = true;
  }
}
