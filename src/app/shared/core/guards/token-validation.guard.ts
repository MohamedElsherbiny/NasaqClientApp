import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const tokenValidationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtHelper = new JwtHelperService();

  const token = localStorage.getItem('token'); // Adjust this based on where you store the token

  if (token && !jwtHelper.isTokenExpired(token)) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
