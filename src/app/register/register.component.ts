import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  message: string = '';
  isLoading: boolean = false;  // Add this line

  constructor(private authService: AuthService, private router: Router,private dialog: MatDialog ) {}

  onSubmit() {
    this.authService.register(this.username, this.password, this.email).subscribe(
      (response) => {
        // Open success dialog
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '300px',
          data: { message: 'Registration successful! Please log in.' }
        });
  
        // After closing the dialog, navigate to the login page
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/login']);
          this.isLoading = false;  // Set isLoading to false after registration
        });
      },
      (error) => {
        this.message = 'Registration failed. Try again.';
        this.isLoading = false;  // Set isLoading to false after failure
      }
    );
  }
  onCancel(): void {
    this.router.navigate(['/login']); // Navigate back to the login page
  }
}
