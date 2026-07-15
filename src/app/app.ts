import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router'; // ⚡ OPTIMIZED IMPORTS
import { CommonModule } from '@angular/common';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // ⚡ REPLACED ROUTERMODULE
  templateUrl: './app.html', 
  styleUrls: ['./app.css']  
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isSeller = false;
  isAdmin = false; 
  userEmail = '';

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Dynamically retrieve user session data on app load
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (email) {
      this.isLoggedIn = true;
      this.userEmail = email;
      
      // Strict role enforcement matching your HTML *ngIf checks
      this.isSeller = role === 'seller';
      this.isAdmin = role === 'admin'; 
    }
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(target.value);
  }

  logout() {
    // 1. Purge local cache
    localStorage.clear();
    
    // 2. Reset UI state variables securely
    this.isLoggedIn = false;
    this.isSeller = false;
    this.isAdmin = false; 
    this.userEmail = '';
    
    // 3. Reroute to root and trigger a hard refresh to destroy active session cache
    this.router.navigate(['/']).then(() => {
      window.location.reload(); 
    });
  }
}