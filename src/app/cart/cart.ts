import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef back
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Kept FormsModule for [(ngModel)] quantity binding
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userEmail: string = '';
  totalPrice: number = 0;

  // Injected 'cdr' for instant UI renders
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email') || '';
    console.log('📡 [Frontend Cart] Component loaded targeting local storage key:', this.userEmail);
    if (this.userEmail) {
      this.loadCart();
    } else {
      console.warn('No user email found. Please log in.');
    }
  }

  // 1. Fetch all items in the user's cart
  loadCart() {
    this.http.get<any>(`http://localhost:5000/api/cart/${this.userEmail}`).subscribe({
      next: (response) => {
        this.cartItems = response.items || response || []; 
        
        this.cartItems.forEach(item => {
          if (!item.quantity) item.quantity = 1;
        });

        this.calculateTotal();
        this.cdr.detectChanges(); // Force Angular to draw the items instantly
      },
      error: (err) => console.error('🔴 [Frontend Cart] Error loading cart:', err)
    });
  }

  // 2. Automatically calculate the total price
  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  // 3. Update the quantity of an item in the DB
  updateQuantity(item: any, newQty: number) {
    if (newQty < 1) {
      item.quantity = 1; 
      newQty = 1;
    }

    const payload = { quantity: newQty };
    const idToSend = item._id || item.productId;
    
    this.http.put(`http://localhost:5000/api/cart/${this.userEmail}/update/${idToSend}`, payload).subscribe({
      next: () => {
        this.calculateTotal(); 
        this.cdr.detectChanges(); // Force repaint
      },
      error: (err) => alert('Failed to update quantity. Check server.')
    });
  }

  // 4. Remove an item entirely from the DB
  removeItem(item: any) {
    const idToSend = item._id || item.productId;

    this.http.delete(`http://localhost:5000/api/cart/${this.userEmail}/remove/${idToSend}`).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(c => c !== item);
        this.calculateTotal();
        this.cdr.detectChanges(); // Force repaint
      },
      error: (err) => alert('Failed to remove item. Check server.')
    });
  }
}