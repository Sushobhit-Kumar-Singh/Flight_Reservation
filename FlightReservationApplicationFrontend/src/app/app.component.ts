import {  Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'FlightReservationApplicationFrontend';
  searchForm: FormGroup= new FormGroup({});


  constructor(
    private authService:AuthService,
    private router: Router,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {
 this.searchForm = this.fb.group({
      searchTerm: ['']
    });  }

    onSearch() {
      this.router.navigate(['/'], { queryParams: { searchTerm:  this.searchForm.value.searchTerm } });
    }

  isLoggedIn(): boolean {
    return this.authService.isAdminOrStaffOrCustomerLoggedIn();
  }

  getLoggedInUserName(): string | null {
    return this.authService.getLoggedInUserName();
  }

}
