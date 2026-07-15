import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html', // Pointing to your specific HTML file
  styleUrls: ['./app.css']   // Point to your CSS file if you have one
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isSeller = false;
  isAdmin = false; // NEW: Track if the logged-in user is an admin
  userEmail = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Check local storage to see if someone is logged in when the app loads
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (email) {
      this.isLoggedIn = true;
      this.userEmail = email;
      
      // Handle the 3-role system checks dynamically
      this.isSeller = role === 'seller';
      this.isAdmin = role === 'admin'; // NEW: Flag true if user is an admin
    }
  }

  logout() {
    // Clear the storage and reset all user state flags
    localStorage.clear();
    this.isLoggedIn = false;
    this.isSeller = false;
    this.isAdmin = false; // NEW: Reset admin status on logout
    this.userEmail = '';
    
    // Redirect to home page
    this.router.navigate(['/']).then(() => {
      // Refresh the window to completely clear state and update components
      window.location.reload(); 
    });
  }
}