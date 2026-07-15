import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // 🚨 This is the injection token Angular was looking for!
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(orderPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/place`, orderPayload);
  }
}