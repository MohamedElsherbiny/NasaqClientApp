import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { Project } from '../../../../../shared/models/Project';
import { CommonModule } from '@angular/common';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-project-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.scss',
})
export class ProjectEditorComponent implements OnInit {
  project: Project = {} as Project;
  projectId: string | null = null;
  employees: PublisherEmployee[] = [];
  selectedTaskId: number | null = null;
  ProjectTaskStatus = ProjectTaskStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private route: ActivatedRoute, private http: HttpService) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.fetchProject();
    this.getEmployees();
  }

  fetchProject(): void {
    this.http
      .get(`Publisher/${this.user['publisherId']}/projects/${this.projectId}`)
      .subscribe({
        next: (response: any) => {
          this.project = response || {};
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }

  getEmployees(): void {
    this.http
      .get<PublisherEmployee[]>(
        `Publisher/${this.user['publisherId']}/employees`
      )
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
      });
  }

  openAssignModal(taskId: number): void {
    this.selectedTaskId = taskId;
    // Show the modal using Bootstrap
    const modalElement = document.getElementById('assgin-employee');
    if (modalElement) {
      new Modal(modalElement).show();
    }
  }

  assignEmployeeToTask(employeeId: number): void {
    if (!this.selectedTaskId) {
      console.error('No task selected for assignment');
      return;
    }

    const request = {
      taskId: this.selectedTaskId,
      employeeId: employeeId,
    };

    this.http
      .post(`Publisher/${this.user['publisherId']}/assign-task`, request)
      .subscribe({
        next: () => {
          this.fetchProject();
        },
        error: (error) => {
          console.error('Failed to assign employee to task', error);
        },
      });
  }
}
