import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (response:any) => {
        console.log('Password reset success', response);
        this.snackBar.open('Password has been successfully reset.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['/login']);
      },
      (error:any) => {
        console.error('Error response:', error);
        this.snackBar.open('Error resetting password.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    );
  }
}
