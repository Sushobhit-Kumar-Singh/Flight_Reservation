import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://localhost:7206/api/Admin';
  private loggedInAdmin: any | null = null;
  private adminId: number | null = null;


  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    
    setAdminId(adminId: number | null): void {
      this.adminId = adminId;
    }

    getAdminId(): number | null {
      return this.adminId;
    }
  

  registerAdmin(admin: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/register`, admin);
  }

  loginAdmin(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response: any) => {
          this.loggedInAdmin = response;
          localStorage.setItem('adminId', response.adminId.toString()??"default value"); 
          return response;
        })
      );
  }

  logout(): void {
    this.loggedInAdmin = null;
    localStorage.removeItem('adminId');
    this.router.navigate(['/']);
    }

  getLoggedInAdmin(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedAdminId = localStorage.getItem('adminId');
      this.loggedInAdmin = storedAdminId ? { adminId: +storedAdminId } : null;
      return this.loggedInAdmin;
    }
    return null;  
  }
}
