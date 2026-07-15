import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="padding: 40px; max-width: 900px; margin: 0 auto; font-family: sans-serif; display: flex; gap: 40px; flex-wrap: wrap;">
      
      <!-- Left Side: Shipping Form -->
      <div style="flex: 2; min-width: 300px; background: #fff; padding: 25px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">💳 Shipping Details</h2>
        
        <form (ngSubmit)="submitOrder()" #checkoutForm="ngForm" style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
          <div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Full Name</label>
            <input type="text" name="fullName" [(ngModel)]="shipping.fullName" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
          </div>

          <div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Complete Delivery Address</label>
            <textarea name="address" [(ngModel)]="shipping.address" required rows="3" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; box-sizing: border-box;"></textarea>
          </div>

          <div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Contact Phone Number</label>
            <input type="text" name="phone" [(ngModel)]="shipping.phone" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
          </div>

          <button type="submit" [disabled]="!checkoutForm.form.valid || checkoutItems.length === 0" 
                  style="width: 100%; background: #28a745; color: white; border: none; padding: 14px; font-size: 1.1rem; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; transition: background 0.3s;">
            Place Order Now 🚀
          </button>
        </form>
      </div>

      <!-- Right Side: Order Summary -->
      <div style="flex: 1; min-width: 250px; background: #f8f9fa; padding: 25px; border: 1px solid #e9ecef; border-radius: 8px; height: fit-content;">
        <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
        
        <div *ngIf="checkoutItems.length === 0" style="color: #777; padding: 20px 0; text-align: center;">
          No items to checkout.
        </div>

        <div *ngIf="checkoutItems.length > 0">
          <div *ngFor="let item of checkoutItems" style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; border-bottom: 1px dashed #ddd; padding-bottom: 8px;">
            <span style="color: #555;">{{ item.name }} <strong style="color: #333;">(x{{ item.quantity }})</strong></span>
            <strong style="color: #333;">₱{{ item.price * item.quantity }}</strong>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 15px; border-top: 2px solid #ccc; font-size: 1.2rem;">
            <span>Total:</span>
            <strong style="color: #dc3545;">₱{{ getTotal() }}</strong>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CheckoutComponent implements OnInit {
  checkoutItems: any[] = [];
  userEmail: string | null = '';
  
  shipping = { fullName: '', address: '', phone: '' };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    if (this.userEmail) {
      this.loadCartData();
    } else {
      alert('Please log in to proceed with checkout.');
      this.router.navigate(['/login']);
    }
  }

  loadCartData() {
    this.cartService.getCart(this.userEmail!).subscribe({
      // FIXED: Explicitly typed 'data' as 'any'
      next: (data: any) => {
        this.checkoutItems = data || [];
        this.cdr.detectChanges(); 
      },
      // FIXED: Explicitly typed 'err' as 'any'
      error: (err: any) => console.error('🔴 Error loading cart for checkout:', err)
    });
  }

  getTotal(): number {
    return this.checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  submitOrder() {
    if (!this.userEmail || this.checkoutItems.length === 0) return;

    const payload = {
      email: this.userEmail,
      items: this.checkoutItems,
      totalAmount: this.getTotal(),
      shippingDetails: this.shipping
    };

    this.orderService.placeOrder(payload).subscribe({
      // FIXED: Explicitly typed 'res' as 'any'
      next: (res: any) => {
        alert(`🎉 Success! ${res.message}\nReference ID: ${res.orderId}`);
        this.router.navigate(['/']); 
      },
      // FIXED: Explicitly typed 'err' as 'any'
      error: (err: any) => {
        console.error('🔴 Order failed:', err);
        alert('Could not complete checkout. Make sure your backend server is running.');
      }
    });
  }
}