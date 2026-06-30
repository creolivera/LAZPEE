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
  email = ''; password = '';
  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:5000/api/auth/register', { email: this.email, password: this.password }).subscribe({
      next: () => { alert('Account created!'); this.router.navigate(['/login']); },
      error: () => alert('Registration failed.')
    });
  }
}