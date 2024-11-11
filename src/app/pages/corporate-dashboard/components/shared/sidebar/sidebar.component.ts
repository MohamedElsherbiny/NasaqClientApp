import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LogoutComponent } from "../../../../../shared/components/logout/logout.component";
import { RoleService } from '../../../../../shared/core/services/role.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, LogoutComponent],
  providers: [RoleService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router, public roleService: RoleService) { }

  isActive(route: string[]): boolean {
    return this.router.isActive(this.router.createUrlTree(route), {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
