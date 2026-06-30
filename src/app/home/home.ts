import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  allProducts: Product[] = []; // Holds everything from DB
  displayedProducts: Product[] = []; // Holds only what is currently filtered
  
  // Added an "All" category so users can reset the filter
  categories = [ 
    { name: 'All', icon: '🏪' }, 
    { name: 'Electronics', icon: '💻' }, 
    { name: 'Home Decor', icon: '🛋️' } 
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('http://localhost:5000/api/products').subscribe(data => {
      this.allProducts = data;
      this.displayedProducts = data; // Initially show all products
    });
  }

  // The new filter function triggered by clicking an icon
  filterByCategory(categoryName: string) {
    if (categoryName === 'All') {
      this.displayedProducts = this.allProducts;
    } else {
      this.displayedProducts = this.allProducts.filter(p => p.category === categoryName);
    }
  }

  addToCart(product: Product) {
    if (product.inventory <= 0) {
      alert('Sorry, this item is out of stock!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    product.inventory--;
    alert(`${product.name} added to cart!`);
  }
}