import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service'; // 🚨 NEW: Import the cart service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  // 🚨 NEW: Injected the CartService into your constructor
  constructor(private http: HttpClient, private cartService: CartService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // Show all products by default when page loads
    });
  }

  filterCategory(category: string) {
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
  }

  // 🚨 NEW: The fully working Add to Cart function!
  addToCart(product: any) {
    const email = localStorage.getItem('email');
    
    // Check if the user is logged in
    if (!email) {
      alert('Please log in first to add items to your cart!');
      return;
    }

    // Prepare the item data to send to the backend
    const itemPayload = {
      name: product.name,
      price: product.price,
      image: product.image || ''
    };

    // Send the data to your backend database via the CartService
    this.cartService.addToCart(email, itemPayload).subscribe({
      next: () => alert(`${product.name} successfully added to your cart! 🛒`),
      error: (err) => {
        console.error('Could not add item:', err);
        alert('Failed to add item. Make sure your backend server is running!');
      }
    });
  }
}