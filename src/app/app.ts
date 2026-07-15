import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from './services/search.service'; // 🚨 NEW: Import the search service

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html', 
  styleUrls: ['./app.css']  
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isSeller = false;
  isAdmin = false; 
  userEmail = '';

  // 🚨 MODIFIED: Injected SearchService into the constructor
  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Check local storage to see if someone is logged in when the app loads
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (email) {
      this.isLoggedIn = true;
      this.userEmail = email;
      
      // Handle the 3-role system checks dynamically
      this.isSeller = role === 'seller';
      this.isAdmin = role === 'admin'; 
    }
  }

  // 🚨 NEW: This captures typing from the header and sends it to the service
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(target.value);
  }

  logout() {
    // Clear the storage and reset all user state flags
    localStorage.clear();
    this.isLoggedIn = false;
    this.isSeller = false;
    this.isAdmin = false; 
    this.userEmail = '';
    
    // Redirect to home page
    this.router.navigate(['/']).then(() => {
      // Refresh the window to completely clear state and update components
      window.location.reload(); 
    });
  }
}