import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { SellerComponent } from './seller/seller';
import { StoreComponent } from './store/store';
import { MessagesComponent } from './messages/messages';
import { LoginComponent } from './login/login'; 
import { AdminComponent } from './admin/admin';
import { sellerGuard } from './seller.guard';
import { CartComponent } from './cart/cart';
import { CheckoutComponent } from './checkout/checkout';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'store/:email', component: StoreComponent },
  { path: 'messages', component: MessagesComponent },
  
  { path: 'admin-dashboard', component: AdminComponent }, 
  
  // 🚨 FIXED: Added these inside the array so Angular knows where to look!
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  
  { 
    path: 'seller-dashboard', 
    component: SellerComponent, 
    canActivate: [sellerGuard] 
  },
  
  // ⚠️ CRITICAL: The wildcard fallback MUST always stay at the very bottom
  { path: '**', redirectTo: '' } 
];