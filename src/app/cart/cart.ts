import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🚨 NEW: Imported ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
      <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">🛒 Your Shopping Cart</h2>

      <!-- Empty State -->
      <div *ngIf="cartItems.length === 0" style="text-align: center; padding: 40px; color: #666;">
        <p style="font-size: 1.2rem;">Your cart is currently empty!</p>
        <button routerLink="/" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
          Shop Now
        </button>
      </div>

      <!-- Items List -->
      <div *ngIf="cartItems.length > 0">
        <div *ngFor="let item of cartItems" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: #333;">{{ item.name }}</h4>
            <span style="color: #666; font-size: 0.9rem;">₱{{ item.price }} x {{ item.quantity }}</span>
          </div>
          <strong style="color: #dc3545;">₱{{ item.price * item.quantity }}</strong>
        </div>

        <!-- Cart Total Summary -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333;">
          <span style="font-size: 1.2rem; font-weight: bold;">Total Amount:</span>
          <strong style="font-size: 1.5rem; color: #dc3545;">₱{{ getTotal() }}</strong>
        </div>

        <button routerLink="/checkout" style="width: 100%; background: #28a745; color: white; border: none; padding: 12px; font-size: 1.1rem; border-radius: 4px; cursor: pointer; margin-top: 20px; font-weight: bold;">
          Proceed to Checkout 💳
        </button>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userEmail: string | null = '';

  // 🚨 NEW: Injected 'cdr' (ChangeDetectorRef) into your constructor parameters
  constructor(private cartService: CartService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    console.log('📡 [Frontend Cart] Component loaded targeting local storage key:', this.userEmail);
    
    if (this.userEmail) {
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.getCart(this.userEmail!).subscribe({
      next: (data) => {
        console.log('🎯 [Frontend Cart] Array data received from database hook:', data);
        this.cartItems = data || [];
        
        // 🚨 NEW: Forcefully commands Angular to process the array data and draw it instantly!
        this.cdr.detectChanges();
      },
      error: (err) => console.error('🔴 [Frontend Cart] HTTP failure reading stream:', err)
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}