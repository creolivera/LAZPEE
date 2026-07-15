import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller.html', 
  styleUrls: ['./seller.css']   
})
export class SellerComponent implements OnInit {
  sellerEmail = localStorage.getItem('email') || '';
  
  // New Product Form Data
  newProduct = { name: '', price: null as number | null, category: '', image: '', inventory: null as number | null, sellerEmail: this.sellerEmail };
  
  // Dashboard Data
  myProducts: any[] = [];
  mySales: any[] = [];

  // Edit State Trackers
  isEditing = false;
  editingProductId = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMyProducts();
    this.loadMySales();
  }

  // --- IMAGE UPLOAD METHODS ---

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.image = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.newProduct.image = ''; 
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // --- CRUD METHODS ---

  addProduct() {
    this.http.post('http://localhost:5000/api/products/add', this.newProduct).subscribe(() => {
      alert('Product added to your store!');
      this.loadMyProducts(); 
      this.resetForm();
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:5000/api/products/delete/${productId}`).subscribe(() => {
        alert('Product deleted!');
        this.loadMyProducts(); 
      });
    }
  }

  editProduct(product: any) {
    this.isEditing = true;
    this.editingProductId = product._id;
    // Spread operator creates a copy so we don't edit the list item directly until saved
    this.newProduct = { ...product };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingProductId = '';
    this.resetForm();
  }

  saveUpdatedProduct() {
    this.http.put(`http://localhost:5000/api/products/update/${this.editingProductId}`, this.newProduct).subscribe(() => {
      alert('Product updated successfully!');
      this.isEditing = false;
      this.editingProductId = '';
      this.loadMyProducts();
      this.resetForm();
    });
  }

  // Helper method to clear the form
  resetForm() {
    this.newProduct = { name: '', price: null, category: '', image: '', inventory: null, sellerEmail: this.sellerEmail }; 
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // --- DATA LOADING METHODS ---

  loadMyProducts() {
    this.http.get<any[]>(`http://localhost:5000/api/products/seller/${this.sellerEmail}`).subscribe(data => {
      this.myProducts = data;
    });
  }

  loadMySales() {
    this.http.get<any[]>(`http://localhost:5000/api/orders/seller/${this.sellerEmail}`).subscribe(orders => {
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