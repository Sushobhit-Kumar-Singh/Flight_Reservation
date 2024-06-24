import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { StaffComponent } from './staff/staff.component';
import { AuthGuard } from './auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { BookflightComponent } from './bookflight/bookflight.component';
import { ProfileComponent } from './profile/profile.component';
import { BookingdetailsComponent } from './bookingdetails/bookingdetails.component';
import { FlightdetailsComponent } from './flightdetails/flightdetails.component';
import { CancelflightComponent } from './cancelflight/cancelflight.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: "staff", component: StaffComponent, canActivate: [AuthGuard], data: { roles: ['staff'] } },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['customer'] } },
  { path: "bookflight/:flightId", component: BookflightComponent, canActivate: [AuthGuard], data: { roles: ['customer'] } },
  { path: "cancelflight/:customerId/:flightId", component: CancelflightComponent, canActivate: [AuthGuard], data: { roles: ['admin','staff'] } },
  { path: "bookingdetails", component: BookingdetailsComponent, canActivate: [AuthGuard], data: { roles: ['customer', 'admin'] } },
  { path: "flightdetails", component: FlightdetailsComponent, canActivate: [AuthGuard], data: { roles: ['customer', 'admin','staff'] } },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "welcome", component: WelcomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
