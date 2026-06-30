import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() { this.loadCart(); }

  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.loadCart();
  }

  checkout() {
    if (this.cartItems.length === 0) return alert('Your cart is empty!');
    const payload = { userEmail: localStorage.getItem('email') || 'guest@lazpee.com', items: this.cartItems, totalAmount: this.total };

    this.http.post('http://localhost:5000/api/orders/checkout', payload).subscribe({
      next: (res: any) => {
        alert('Checkout Successful! ID: ' + res.orderId);
        localStorage.removeItem('cart');
        this.router.navigate(['/']);
      },
      error: () => alert('Checkout failed.')
    });
  }
}