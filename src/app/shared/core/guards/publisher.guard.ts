import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const publisherGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  if (user && (user[roleKey] as string)?.includes('Publisher')) {
    return true;
  } else {
    router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
