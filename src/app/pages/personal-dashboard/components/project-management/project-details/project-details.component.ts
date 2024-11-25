import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../../shared/models/Project';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';
import { CommonModule } from '@angular/common';
import { DownloadFileComponent } from '../../../../../shared/components/download-file/download-file.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, DownloadFileComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project: Project = {} as Project;
  projectId: string | null = null;
  selectedTaskId: number | null = null;
  ProjectTaskStatus = ProjectTaskStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.fetchProject();
  }

  fetchProject(): void {
    this.http
      .get(`Author/${this.user['authorId']}/projects/${this.projectId}`)
      .subscribe({
        next: (response: any) => {
          this.project = response || {};
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }


}
