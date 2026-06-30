import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // FormsModule is required for inputs
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // (Assuming you are using the CSS provided earlier)
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    const userData = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/api/auth/register', userData).subscribe({
      next: (res: any) => {
        alert('Account successfully created! You can now log in.');
        this.router.navigate(['/login']); // Send them to login page
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed. Email might already exist.');
      }
    });
  }
}