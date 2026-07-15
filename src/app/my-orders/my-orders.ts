import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 900px; margin: 40px auto; padding: 20px; font-family: sans-serif;">
      
      <div style="border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; color: #333;">📦 My Purchase History</h2>
        <a routerLink="/" style="color: #007bff; text-decoration: none; font-weight: bold;">← Back to Shop</a>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 30px; color: #777;">
        Loading your orders...
      </div>

      <div *ngIf="!loading && orders.length === 0" style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; color: #666;">
        <h3 style="margin: 0 0 10px 0;">You haven't placed any orders yet!</h3>
        <p style="margin: 0 0 20px 0;">Head back to the shop to find items you love.</p>
        <button routerLink="/" style="background: #dc3545; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 4px; cursor: pointer;">Shop Now</button>
      </div>

      <div *ngIf="!loading && orders.length > 0" style="display: flex; flex-direction: column; gap: 20px;">
        <div *ngFor="let order of orders" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
            <div>
              <span style="color: #718096; font-size: 0.85rem;">ORDER ID: </span>
              <strong style="font-family: monospace; color: #2d3748;">{{ order._id }}</strong>
              <span style="margin-left: 15px; color: #a0aec0; font-size: 0.85rem;">{{ order.createdAt | date:'mediumDate' }}</span>
            </div>
            
            <span [ngStyle]="{
              'background-color': order.status === 'Pending' ? '#feebc8' : order.status === 'Shipped' ? '#ebf8ff' : '#c6f6d5',
              'color': order.status === 'Pending' ? '#c05621' : order.status === 'Shipped' ? '#2b6cb0' : '#22543d'
            }" style="padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">
              ● {{ order.status || 'Pending' }}
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div *ngFor="let item of order.items" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img [src]="item.image || 'https://via.placeholder.com/40'" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover; border: 1px solid #eee;">
                <span style="color: #4a5568;">{{ item.name }} <strong style="color: #718096;">x{{ item.quantity }}</strong></span>
              </div>
              <strong style="color: #2d3748;">₱{{ item.price * item.quantity }}</strong>
            </div>
          </div>

          <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.85rem; color: #718096;">
              <strong>Deliver to:</strong> {{ order.shippingDetails?.fullName }} | {{ order.shippingDetails?.phone }}
            </div>
            <div>
              <span style="font-size: 0.9rem; color: #4a5568;">Total Paid: </span>
              <strong style="font-size: 1.25rem; color: #e53e3e; margin-left: 5px;">₱{{ order.totalAmount }}</strong>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userEmail: string = '';
  loading: boolean = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email') || '';
    if (this.userEmail) {
      this.fetchUserOrders();
    } else {
      this.loading = false;
    }
  }

  fetchUserOrders() {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:5000/api/orders/user/${this.userEmail}`).subscribe({
      next: (data) => {
        this.orders = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🔴 Error fetching customer order logs:', err);
        this.loading = false;
      }
    });
  }
}