import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${email}`);
  }

  addToCart(email: string, item: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/add`, { email, item });
  }
}