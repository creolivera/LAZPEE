import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'customer'; // Default role for the UI dropdown

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      return;
    }

    // Include the role in the data sent to the backend
    const userData = { 
      email: this.email, 
      password: this.password,
      role: this.role 
    };

    this.http.post('http://localhost:5000/api/auth/register', userData).subscribe({
      next: (res: any) => {
        alert(`Account successfully created as a ${this.role}! You can now log in.`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed. Email might already exist.');
      }
    });
  }
}