import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AdminObject } from '../model/admin-object.module';
import { StaffObject } from '../model/staff-object.module';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable,  throwError } from 'rxjs';
import { AdminService } from './admin.service';
import { StaffService } from './staff.service';
import { CustomerObject } from '../model/customer-object.module';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInAdmin: AdminObject | null = null;
  private loggedInStaff: StaffObject | null = null;
  private loggedInCustomer: CustomerObject | null = null;
  private loggedInUserName: string | null = null;


  constructor(private router: Router, 
    private adminService: AdminService,
    private staffService: StaffService,
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAuthState();
    }
  }
  
  login(credentials: any, userType: string): Observable<any> {
    if (userType === 'admin') {
      return this.adminService.loginAdmin(credentials);
    } else if (userType === 'staff') {
      return this.staffService.loginStaff(credentials);
    } else if (userType === 'customer') {
      return this.customerService.loginCustomer(credentials);
    } else {
      return throwError(() => new Error('Invalid user type'));
    }
  }

  setLoggedInAdmin(admin: AdminObject): void {
    this.loggedInAdmin = admin;
    localStorage.setItem('adminId', admin.adminId.toString() ?? "default value");
    this.saveAuthState();
  }

  setLoggedInStaff(staff: StaffObject): void {
    this.loggedInStaff = staff;
    this.saveAuthState();
  }

  setLoggedInCustomer(customer: CustomerObject): void {
    this.loggedInCustomer = customer;
    this.customerService.setCustomerId(customer?.customerId ?? null);
    this.saveAuthState();
  }

  clearAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInAdmin');
      localStorage.removeItem('loggedInStaff');
      localStorage.removeItem('loggedInCustomer');
    }
    this.loggedInAdmin = null;
    this.loggedInStaff = null;
    this.loggedInCustomer = null;
    this.router.navigate(['/']);
  }

  isAdminOrStaffOrCustomerLoggedIn(): boolean {
    return this.loggedInAdmin !== null || this.loggedInStaff !== null || this.loggedInCustomer !== null;
  }

  getCurrentUser(): AdminObject | StaffObject | CustomerObject | null {
    return this.loggedInAdmin || this.loggedInStaff || this.loggedInCustomer;
  }

  private getLocalStorageItem(key: string): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : null;
  }

  getCurrentUserType(): 'admin' | 'staff' | 'customer' | null {
    if (this.loggedInAdmin) {
      return 'admin';
    } else if (this.loggedInStaff) {
      return 'staff';
    } else if (this.loggedInCustomer) {
      return 'customer';
    } else {
      return null;
    }  
  }

  getCurrentUserRoles(): string[] {
    const userType = this.getCurrentUserType();
    switch (userType) {
      case 'admin':
        return ['admin'];
      case 'staff':
        return ['staff'];
      case 'customer':
        return ['customer'];
      default:
        return [];
    }
  }

  setLoggedInUser(user: AdminObject | StaffObject | CustomerObject, userType: string): void {
    if (userType === 'admin') {
      this.setLoggedInAdmin(user as AdminObject);
    } else if(userType === 'staff') {
      this.setLoggedInStaff(user as StaffObject);
    }else{
      this.setLoggedInCustomer(user as CustomerObject);
      this.loggedInUserName = `${(user as CustomerObject).firstName} ${(user as CustomerObject).lastName}`;
    }
  }

  getLoggedInUserName(): string {
    const user = this.getCurrentUser();
    const userType = this.getCurrentUserType();
  
    if (this.isAdminOrStaffOrCustomerLoggedIn()) {
      switch (userType) {
        case 'admin':
          return 'Admin';
        case 'staff':
          return 'Staff';
        case 'customer':
          return `${(user as CustomerObject).firstName} ${(user as CustomerObject).lastName}`;
        default:
          return 'My Account';
      }
    }
  
    return 'My Account';
  }
  

  private setLocalStorageItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  private loadAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedAdmin = this.getLocalStorageItem('loggedInAdmin');
        const storedStaff = this.getLocalStorageItem('loggedInStaff');
        const storedCustomer = this.getLocalStorageItem('loggedInCustomer');

        this.loggedInAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;
        this.loggedInStaff = storedStaff ? JSON.parse(storedStaff) : null;
        this.loggedInCustomer = storedCustomer ? JSON.parse(storedCustomer) : null;

        if (this.loggedInAdmin) {
          this.adminService.setAdminId(this.loggedInAdmin?.adminId ?? null);
        } else if (this.loggedInCustomer) {
          this.customerService.setCustomerId(this.loggedInCustomer?.customerId ?? null);
        }else if (this.loggedInStaff) {
          this.staffService.setStaffId(this.loggedInStaff?.staffId ?? null);
        }
        
      } catch (error) {
        console.error('Error loading authentication state:', error);
      }
    }
  }

  private saveAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setLocalStorageItem('loggedInAdmin', this.loggedInAdmin);
      this.setLocalStorageItem('loggedInStaff', this.loggedInStaff);
      this.setLocalStorageItem('loggedInCustomer', this.loggedInCustomer);
    }
  }
}
