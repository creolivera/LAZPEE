import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store.html',
})
export class StoreComponent implements OnInit {
  storeEmail: string = '';
  storeProducts: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.storeEmail = this.route.snapshot.paramMap.get('email') 
                   || this.route.snapshot.paramMap.get('id') 
                   || this.route.snapshot.paramMap.get('sellerEmail') 
                   || '';
                   
    if (this.storeEmail && this.storeEmail !== 'undefined') {
      this.loadStoreProducts();
    }
  }

  loadStoreProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (allProducts) => {
        const targetEmail = this.storeEmail.trim().toLowerCase();
        
        this.storeProducts = allProducts.filter(product => {
          const dbEmail = (product.sellerEmail || product.email || product.seller || '');
          return dbEmail.trim().toLowerCase() === targetEmail;
        });
        
        // Refresh the UI to display the new products
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error fetching store products:', err)
    });
  }

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
}