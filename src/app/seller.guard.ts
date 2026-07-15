import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const sellerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  // If the user is logged in and their role is exactly 'seller', let them through
  if (email && role === 'seller') {
    return true;
  }

  // Otherwise, kick them back to the home page with an alert
  alert('🚫 Access Denied! Only logged-in sellers can enter the Seller Hub.');
  router.navigate(['/']);
  return false;
};