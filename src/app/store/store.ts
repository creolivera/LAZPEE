import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store.html',

})
export class StoreComponent implements OnInit {
  storeEmail: string = '';
  storeProducts: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Grab the seller's email from the URL (e.g., lazpee.com/store/seller@test.com)
    this.storeEmail = this.route.snapshot.paramMap.get('email') || '';
    this.loadStoreProducts();
  }

  loadStoreProducts() {
    this.http.get<any[]>(`http://localhost:5000/api/products/seller/${this.storeEmail}`).subscribe(data => {
      this.storeProducts = data;
    });
  }

  addToCart(product: any) {
    // Add your existing cart logic here!
    alert(`${product.name} added to your cart!`);
  }
}