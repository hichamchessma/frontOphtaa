import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})



export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe(
      (response) => {
        this.snackBar.open('Password reset link has been sent to your email.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      (error) => {
        this.snackBar.open('Error sending reset link.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    );
  }
}

