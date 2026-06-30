import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = ''; password = '';
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:5000/api/auth/login', { email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', res.email);
        alert('Welcome back!'); this.router.navigate(['/']);
      },
      error: () => alert('Invalid credentials.')
    });
  }
}