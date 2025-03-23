import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTasks,
  faBook,
  faProjectDiagram,
  faStarHalf,
  faBuilding,
  faShareSquare,
  faFileContract,
  faDashboard,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../../../../../shared/core/services/role.service';
import { LogoutComponent } from '../../../../../shared/components/logout/logout.component';
import { SidebarService } from '../services/sidebar.service';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { Project } from '../../../../../shared/models/Project';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LogoutComponent, FontAwesomeModule, RouterLink, RouterLinkActive],
  providers: [RoleService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  projects: Project[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  // Font Awesome icons
  faTasks = faTasks;
  faProjectDiagram = faProjectDiagram;
  faBook = faBook;
  faStarHalf = faStarHalf;
  faBuilding = faBuilding;
  faShareSquare = faShareSquare;
  faFileContract = faFileContract;
  faDashboard = faDashboard;
  faChevronRight = faChevronRight;

  constructor(
    private sidebarService: SidebarService,
    private http: HttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sidebarService.getIsCollapsed().subscribe(
      collapsed => this.isCollapsed = collapsed
    );

    this.fetchProjects();
  }

  fetchProjects(): void {
    this.http.get(`Author/${this.user['authorId']}/projects`).subscribe({
      next: (response: any) => {
        this.projects = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch projects', error);
      },
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
