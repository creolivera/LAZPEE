import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {
  sellers: any[] = [];
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Security check: Boot the user out if they aren't an admin
    if (localStorage.getItem('role') !== 'admin') {
      alert('🚫 Access Denied. Only Administrators can view this page.');
      this.router.navigate(['/']);
      return;
    }
    
    this.fetchSellers();
  }

  fetchSellers() {
    this.http.get<any[]>('http://localhost:5000/api/admin/sellers').subscribe({
      next: (data) => this.sellers = data,
      error: (err) => this.errorMessage = 'Failed to load sellers from the database.'
    });
  }

  approveSeller(email: string) {
    this.http.put('http://localhost:5000/api/admin/approve-seller', { email }).subscribe({
      next: () => {
        alert(`${email} has been approved!`);
        this.fetchSellers(); // Refresh the list so the button disappears
      },
      error: (err) => alert('Error approving seller.')
    });
  }
}