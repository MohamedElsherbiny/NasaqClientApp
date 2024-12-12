import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../../../../shared/models/Project';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUser, faBook, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project: Project = {} as Project;
  @Input() projectId: number | null = null;
  selectedTaskId: number | null = null;
  ProjectTaskStatus = ProjectTaskStatus;
  @Output() close = new EventEmitter<void>();

  // Font Awesome icons
  faTimes = faTimes;
  faUser = faUser;
  faBook = faBook;
  faCalendar = faCalendar;
  faCheck = faCheck;

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit(): void {
    this.fetchProject();
  }

  fetchProject(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http
      .get(`Author/${user['authorId']}/projects/${this.projectId}`)
      .subscribe({
        next: (response: any) => {
          this.project = response || {};
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }
  onClose() {
    this.close.emit();
  }

  getStatusColor(status: ProjectTaskStatus): string {
    switch (status) {
      case ProjectTaskStatus.NotAssigned:
        return '#ef4444';
      case ProjectTaskStatus.InProgress:
        return '#3b82f6';
      case ProjectTaskStatus.Pending:
        return '#f59e0b';
      case ProjectTaskStatus.Completed:
        return '#10b981';
      default:
        return '#ef4444';
    }
  }

}
