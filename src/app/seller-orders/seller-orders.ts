import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div style="max-width: 1200px; margin: 30px auto; padding: 20px; font-family: sans-serif;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333;">📦 Seller Order Management</h2>
        <span style="color: #666; font-size: 0.95rem;">Logged in as: <strong>{{ sellerEmail }}</strong></span>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 40px; color: #888; font-size: 1.2rem;">
        Loading incoming store orders...
      </div>

      <div *ngIf="!loading && orders.length === 0" style="text-align: center; padding: 50px; background: #f9f9f9; border-radius: 8px; color: #666;">
        <h3 style="margin: 0 0 10px 0;">No orders found</h3>
        <p style="margin: 0;">When customers purchase your items, they will appear here right away!</p>
      </div>

      <div *ngIf="!loading && orders.length > 0" style="display: flex; flex-direction: column; gap: 20px;">
        <div *ngFor="let order of orders" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; background: #f8f9fa; padding: 12px 15px; margin: -20px -20px 20px -20px; border-top-left-radius: 7px; border-top-right-radius: 7px; border-bottom: 1px solid #eef0f2;">
            <div>
              <span style="color: #666; font-size: 0.85rem;">ORDER ID:</span>
              <strong style="font-family: monospace; font-size: 0.95rem; margin-left: 5px; color: #007bff;">{{ order._id }}</strong>
              <span style="margin-left: 15px; color: #999; font-size: 0.85rem;">Placed on: {{ order.createdAt | date:'medium' }}</span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
              <label style="font-size: 0.9rem; font-weight: bold; color: #444;">Fulfillment Status:</label>
              <select [ngModel]="order.status" (ngModelChange)="updateOrderStatus(order._id, $event)" 
                [ngStyle]="{
                  'background-color': order.status === 'Shipped' ? '#e6f7ff' : order.status === 'Delivered' ? '#f6ffed' : '#fff7e6',
                  'color': order.status === 'Shipped' ? '#096dd9' : order.status === 'Delivered' ? '#389e0d' : '#d46b08',
                  'border-color': order.status === 'Shipped' ? '#91d5ff' : order.status === 'Delivered' ? '#b7eb8f' : '#ffd591'
                }"
                style="padding: 6px 12px; font-weight: bold; border-radius: 4px; border: 1px solid; cursor: pointer; outline: none;">
                <option *ngFor="let option of statusOptions" [value]="option">{{ option }}</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px;">
            <div>
              <h4 style="margin: 0 0 12px 0; color: #555; font-size: 0.95rem; text-transform: uppercase;">🛒 Ordered Items</h4>
              <div *ngFor="let item of order.items" style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px; border-bottom: 1px dashed #f0f0f0; padding-bottom: 10px;">
                <div style="flex-grow: 1;">
                  <h5 style="margin: 0 0 4px 0; color: #333; font-size: 0.95rem;">{{ item.name }}</h5>
                  <span style="color: #777; font-size: 0.85rem;">₱{{ item.price }} x {{ item.quantity }}</span>
                </div>
                <strong style="color: #333;">₱{{ item.price * item.quantity }}</strong>
              </div>
              <div style="text-align: right; margin-top: 15px;">
                <span style="color: #666;">Total Order Gross: </span>
                <strong style="font-size: 1.2rem; color: #ff4d4f; margin-left: 5px;">₱{{ order.totalAmount }}</strong>
              </div>
            </div>

            <div style="border-left: 1px solid #f0f0f0; padding-left: 25px;">
              <h4 style="margin: 0 0 12px 0; color: #555; font-size: 0.95rem; text-transform: uppercase;">📍 Shipping Info</h4>
              <div style="background: #fafafa; padding: 15px; border-radius: 6px; font-size: 0.9rem; line-height: 1.6;">
                <p style="margin: 0 0 8px 0;"><strong>Customer:</strong> {{ order.email }}</p>
                <p style="margin: 0 0 8px 0;"><strong>Recipient:</strong> {{ order.shippingDetails?.fullName || 'N/A' }}</p>
                <p style="margin: 0 0 8px 0;"><strong>Address:</strong> {{ order.shippingDetails?.address || 'N/A' }}</p>
                <p style="margin: 0;"><strong>Phone:</strong> {{ order.shippingDetails?.phone || 'N/A' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `
})
export class SellerOrdersComponent implements OnInit {
  orders: any[] = [];
  sellerEmail: string = '';
  loading: boolean = true;
  statusOptions: string[] = ['Pending', 'Shipped', 'Delivered'];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.sellerEmail = localStorage.getItem('email') || '';
    if (this.sellerEmail) {
      this.loadSellerOrders();
    } else {
      this.loading = false;
    }
  }

  loadSellerOrders() {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:5000/api/orders/seller/${this.sellerEmail}`).subscribe({
      next: (data) => {
        this.orders = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load seller orders:', err);
        this.loading = false;
      }
    });
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.http.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: (updatedOrder: any) => {
        const idx = this.orders.findIndex(o => o._id === orderId);
        if (idx !== -1) this.orders[idx].status = updatedOrder.status;
        alert(`Order updated to: ${newStatus} 🎉`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Could not change status.');
      }
    });
  }
}