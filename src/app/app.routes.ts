import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CartComponent } from './cart/cart';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { SellerComponent } from './seller/seller';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'seller-dashboard', component: SellerComponent },
  { path: '**', redirectTo: '' }
];