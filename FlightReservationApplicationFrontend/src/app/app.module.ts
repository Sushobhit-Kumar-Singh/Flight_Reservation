import { NgModule } from '@angular/core';
import { BrowserModule,provideClientHydration} from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlightService } from './services/flight.service';
import { HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { AdminComponent } from './admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register/register.component';
import { AdminService } from './services/admin.service';
import { StaffService } from './services/staff.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotificationService } from './services/notifications.service';
import { StaffComponent } from './staff/staff.component';
import { AuthService } from './services/auth.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { CustomerService } from './services/customer.service';
import { BookflightComponent } from './bookflight/bookflight.component';
import { ProfileComponent } from './profile/profile.component';
import { BookingdetailsComponent } from './bookingdetails/bookingdetails.component';
import { FlightdetailsComponent } from './flightdetails/flightdetails.component';
import { CancelflightComponent } from './cancelflight/cancelflight.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    StaffComponent,
    WelcomeComponent,
    BookflightComponent,
    ProfileComponent,
    BookingdetailsComponent,
    FlightdetailsComponent,
    CancelflightComponent
      ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
    ],
  providers: [
    FlightService,
    AdminService,
    StaffService,
    CustomerService,
    NotificationService,
    AuthService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
