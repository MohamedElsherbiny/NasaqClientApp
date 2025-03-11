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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorProjectEditorComponent } from "./author-project-editor/author-project-editor.component";

@Component({
  selector: 'app-author-projects',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ProjectDetailsComponent, RouterLink, AuthorProjectEditorComponent],
  templateUrl: './author-projects.component.html',
  styleUrl: './author-projects.component.scss',
})
export class AuthorProjectsComponent implements OnInit {
  RequestStatus = RequestStatus;
  projects: Project[] = [];
  projectId: number | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  showForm = false;
  showCreateProjectEditor = false;

  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faCircle = faCircle;
  faEye = faEye;

  constructor(private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchProjects();
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
    });
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

  closeCreateProjectEditor($event: boolean) {
    this.showCreateProjectEditor = false;
    if ($event) {
      this.fetchProjects();
    }
  }

  openCreateProjectEditor() {
    this.showCreateProjectEditor = true;
  }
  
  closeForm(): void {
    this.showForm = false;
    // this.selectedProject = null;
  }

  onSaveProject(project: Project): void {
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
