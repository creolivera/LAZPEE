import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller.html', // Updated to match your file name
  styleUrls: ['./seller.css']   // Updated to match your file name
})
export class SellerComponent implements OnInit {
  sellerEmail = localStorage.getItem('email') || '';
  
  // New Product Form Data
  newProduct = { name: '', price: null, category: '', image: '', inventory: null, sellerEmail: this.sellerEmail };
  
  // Dashboard Data
  myProducts: any[] = [];
  mySales: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMyProducts();
    this.loadMySales();
  }

  addProduct() {
    this.http.post('http://localhost:5000/api/products/add', this.newProduct).subscribe(() => {
      alert('Product added to your store!');
      this.loadMyProducts(); // Refresh inventory list
      this.newProduct = { name: '', price: null, category: '', image: '', inventory: null, sellerEmail: this.sellerEmail }; // reset form
    });
  }

  loadMyProducts() {
    this.http.get<any[]>(`http://localhost:5000/api/products/seller/${this.sellerEmail}`).subscribe(data => {
      this.myProducts = data;
    });
  }

  loadMySales() {
    this.http.get<any[]>(`http://localhost:5000/api/orders/seller/${this.sellerEmail}`).subscribe(orders => {
      // Filter the order items to only show the items that belong to THIS seller
      let salesList: any[] = [];
      orders.forEach(order => {
        order.items.forEach((item: any) => {
          if (item.sellerEmail === this.sellerEmail) {
            salesList.push({ customer: order.userEmail, itemName: item.name, price: item.price, date: order.date });
          }
        });
      });
      this.mySales = salesList;
    });
  }
}