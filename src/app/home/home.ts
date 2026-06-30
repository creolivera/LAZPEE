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
  products: Product[] = [];
  categories = [ { name: 'Electronics', icon: '💻' }, { name: 'Home Decor', icon: '🛋️' } ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('http://localhost:5000/api/products').subscribe(data => this.products = data);
  }

  // This calls your backend to insert the sample products
  seedDatabase() {
    this.http.post('http://localhost:5000/api/products/seed', {}).subscribe({
      next: () => {
        alert('Products successfully added to MongoDB Atlas!');
        this.loadProducts(); // Refresh the screen to show the new items
      },
      error: () => alert('Failed to seed database.')
    });
  }

  addToCart(product: Product) {
    if (product.inventory <= 0) {
      alert('Sorry, this item is out of stock!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Temporarily reduce inventory on the screen to show the user it was taken
    product.inventory--;
    
    alert(`${product.name} added to cart!`);
  }
}