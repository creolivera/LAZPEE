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

// 🚨 FIXED IMPORTS: Correctly pointing inside the folders to the exact file names
import { MyOrdersComponent } from './my-orders/my-orders';
import { SellerOrdersComponent } from './seller-orders/seller-orders';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'store/:email', component: StoreComponent },
  { path: 'messages', component: MessagesComponent },
  
  { path: 'admin-dashboard', component: AdminComponent }, 
  
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  
  // 🚀 NEW: Customer order tracking history page
  { path: 'my-orders', component: MyOrdersComponent }, 
  
  { 
    path: 'seller-dashboard', 
    component: SellerComponent, 
    canActivate: [sellerGuard] 
  },

  // 🚀 NEW: Seller order status management page (🔒 Guarded for safety!)
  { 
    path: 'seller-orders', 
    component: SellerOrdersComponent, 
    canActivate: [sellerGuard] 
  },
  
  // ⚠️ CRITICAL: The wildcard fallback stays safely at the very bottom
  { path: '**', redirectTo: '' } 
];