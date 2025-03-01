import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { HttpService } from '../services/http.service';
import { map } from 'rxjs';


export const completeProfileGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpService);
  const router = inject(Router);

  return http.get('account/getProfile').pipe(
    map((response: any) => {
      if (response.isPublisher && !response.profileCompleted) {
        router.navigate(['/publisher-dashboard/complete-profile']);
        return false;
      }

      if (!response.isPublisher && !response.profileCompleted) {
        router.navigate(['/author-dashboard/complete-profile']);
        return false;
      }

      return true;
    })
  );

};
