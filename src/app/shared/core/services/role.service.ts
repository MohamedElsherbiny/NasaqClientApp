import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  getUserRoles(): string[] {
    const user = localStorage.getItem('user');
    if (!user) {
      return [];
    }

    const decodedToken = JSON.parse(user);
    const roles = decodedToken?.[this.roleKey];
    return Array.isArray(roles) ? roles : [roles];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isAuthor(): boolean {
    return this.hasRole('Author');
  }

  isPublisher(): boolean {
    return this.hasRole('Publisher');
  }

  isPublisherEmployee(): boolean {
    return this.hasRole('PublisherEmployee');
  }

  isAuthorOrPublisher(): boolean {
    return this.isAuthor() || this.isPublisher();
  }
}
