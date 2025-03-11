import { Component } from '@angular/core';
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
  faElevator,
  faFileContract,
  faDashboard,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../../../../../shared/core/services/role.service';
import { LogoutComponent } from '../../../../../shared/components/logout/logout.component';
import { SidebarService } from '../services/sidebar.service';
import { ProjectService } from '../../publisher-projects/projects.service';
import { Project } from '../../../../../shared/models/Project';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LogoutComponent, FontAwesomeModule, RouterLink, RouterLinkActive, FormsModule],
  providers: [RoleService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;
  selectedProjectId: number | null = null;
  projects: Project[] = [];

  // Font Awesome icons
  faTasks = faTasks;
  faProjectDiagram = faProjectDiagram;
  faBook = faBook;
  faStarHalf = faStarHalf;
  faBuilding = faBuilding;
  faShareSquare = faShareSquare;
  faElevator = faElevator;
  faFileContract = faFileContract;
  faDashboard = faDashboard;
  faChevronRight = faChevronRight;

  constructor(
    private sidebarService: SidebarService,
    private projectService: ProjectService,
    private router: Router,
    public roleService: RoleService
  ) { }

  ngOnInit() {
    this.sidebarService.getIsCollapsed().subscribe(
      collapsed => this.isCollapsed = collapsed
    );

    this.projectService.getProjects().subscribe(
      projects => {
        this.projects = projects;
        this.selectedProjectId = projects[0]?.projectId;
      }
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
