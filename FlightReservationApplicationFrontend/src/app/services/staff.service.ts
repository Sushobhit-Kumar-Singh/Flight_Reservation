import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private baseUrl="https://localhost:7206/api/Staff"
  private loggedInStaff: any | null = null;
  private staffId: number | null = null;


  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    setStaffId(staffId: number | null): void {
      this.staffId = staffId;
    }

    getStaffId(): number | null {
      return this.staffId;
    }


  registerStaff(admin: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/register`, admin);
  }

  loginStaff(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response: any) => {
          this.loggedInStaff = response;
  
          this.loggedInStaff.staffId = response.staffId !== undefined ? response.staffId : "default value";
  
          localStorage.setItem('staffId', this.loggedInStaff.staffId.toString());
  
          return response;
        })
      );
  }
  
  

  logout(): void {
    this.loggedInStaff = null;
    localStorage.removeItem('staffId');
    this.router.navigate(['/']);  }

  getLoggedInStaff(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedStaffId = localStorage.getItem('staffId');
      this.loggedInStaff = storedStaffId ? { staffId: +storedStaffId } : null;
      return this.loggedInStaff && !isNaN(this.loggedInStaff.staffId) ? this.loggedInStaff : null;
    }
    return null;
  }

}
