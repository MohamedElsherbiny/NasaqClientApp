import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) { }

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

  isIndividual(): boolean {
    const user = localStorage.getItem('user');
    if (!user) {
      return false;
    }

    const decodedToken = JSON.parse(user);
    return decodedToken?.['publisherType'] === "Individual";
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
