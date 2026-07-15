import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; // 🚨 NEW: Used to prevent memory leaks
import { CartService } from '../services/cart.service'; 
import { SearchService } from '../services/search.service'; // 🚨 NEW: Import the search service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  private searchSub!: Subscription; // 🚨 NEW: Holds the active search subscription

  // 🚨 MODIFIED: Injected SearchService into the constructor
  constructor(
    private http: HttpClient, 
    private cartService: CartService,
    private searchService: SearchService 
  ) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  // 🚨 MODIFIED: Call listenToSearch() once products are fetched from the database
  loadAllProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe(data => {
      this.products = data;
      this.filteredProducts = data; 
      this.listenToSearch(); 
    });
  }

  // 🚨 NEW: Listens to the header search bar in real-time
  listenToSearch() {
    this.searchSub = this.searchService.currentSearchTerm.subscribe((term) => {
      if (!term) {
        // If the search bar is cleared, reset to show all products
        this.filteredProducts = this.products; 
      } else {
        // Filter the array based on the typed product name
        this.filteredProducts = this.products.filter(product => 
          product.name.toLowerCase().includes(term)
        );
      }
    });
  }

  // ✅ KEPT: Your original category filtering logic
  filterCategory(category: string) {
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
  }

  // ✅ KEPT: Your original working Add to Cart function
  addToCart(product: any) {
    const email = localStorage.getItem('email');
    
    if (!email) {
      alert('Please log in first to add items to your cart!');
      return;
    }

    const itemPayload = {
      name: product.name,
      price: product.price,
      image: product.image || ''
    };

    this.cartService.addToCart(email, itemPayload).subscribe({
      next: () => alert(`${product.name} successfully added to your cart! 🛒`),
      error: (err) => {
        console.error('Could not add item:', err);
        alert('Failed to add item. Make sure your backend server is running!');
      }
    });
  }

  // 🚨 NEW: Clean up the subscription when navigating away from the home page
  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}