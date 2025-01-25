import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { MedicalFolderComponent } from './components/medical-folder/medical-folder.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent , canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent , canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent , canActivate: [AuthGuard]},
  { path: 'reset-password', component: ResetPasswordComponent , canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent  , canActivate: [AuthGuard]},
  { path: 'patients', component: PatientsComponent , canActivate: [AuthGuard]},
  { path: 'patient-list', component: PatientListComponent , canActivate: [AuthGuard]},
  { path: 'rendez-vous', component: AppointmentComponent , canActivate: [AuthGuard]},
  { path: 'dossiers-medicaux', component: MedicalFolderComponent , canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
