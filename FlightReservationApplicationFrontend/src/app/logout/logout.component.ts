import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private location: Location
    ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.clearAuthState();
  }  
}
