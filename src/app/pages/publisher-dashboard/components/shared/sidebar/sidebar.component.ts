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
  faElevator
} from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../../../../../shared/core/services/role.service';
import { LogoutComponent } from '../../../../../shared/components/logout/logout.component';
import { SidebarService } from '../services/sidebar.service';
import { ProjectService } from '../../publisher-projects/projects.service';
import { Project } from '../../../../../shared/models/Project';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LogoutComponent, FontAwesomeModule, RouterLink, RouterLinkActive],
  providers: [RoleService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;
  projects: Project[] = [];

  // Font Awesome icons
  faTasks = faTasks;
  faProjectDiagram = faProjectDiagram;
  faBook = faBook;
  faStarHalf = faStarHalf;
  faBuilding = faBuilding;
  faShareSquare = faShareSquare;
  faElevator = faElevator;

  constructor(
    private sidebarService: SidebarService,
    private projectService: ProjectService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sidebarService.getIsCollapsed().subscribe(
      collapsed => this.isCollapsed = collapsed
    );

    this.projectService.getProjects().subscribe(
      projects => this.projects = projects
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }


  toggleProjectSelector($event: any): void {
    this.projectService.setSelectedProjectId($event.target.value);
  }
}
