import { Component, HostListener, OnInit } from '@angular/core';
import { RequestStatus } from '../../../../shared/models/RequestStatus';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../shared/models/Project';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faEllipsisVertical,
  faPen,
  faTrash,
  faUsers,
  faCalendar,
  faCircle,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { ProjectDetailsComponent } from './project-details/project-details.component';

@Component({
  selector: 'app-author-projects',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ProjectDetailsComponent],
  templateUrl: './author-projects.component.html',
  styleUrl: './author-projects.component.scss',
})
export class AuthorProjectsComponent implements OnInit {
  RequestStatus = RequestStatus;
  projects: Project[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  showForm = false;
  selectedProject: Project | null = null;

  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faCircle = faCircle;
  faEye = faEye;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
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

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'معلق';
      default: return status;
    }
  }

  onAddProject(): void {
    this.selectedProject = null;
    this.showForm = true;
  }

  editProject(project: Project): void {
    this.selectedProject = project;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedProject = null;
  }

  onSaveProject(project: Project): void {
    // if (this.selectedProject) {
    //   this.projectService.updateProject({ ...project, id: this.selectedProject.id });
    // } else {
    //   this.projectService.addProject({ ...project, id: Date.now().toString() });
    // }
    this.closeForm();
  }

  toggleMenu(event: Event, projectId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === projectId ? null : projectId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }
}
