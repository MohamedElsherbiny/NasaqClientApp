import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ProjectTask } from '../../../../shared/models/ProjectTask';
import { ProjectTaskStatus } from '../../../../shared/models/ProjectTaskStatus';
import { DownloadFileComponent } from '../../../../shared/components/download-file/download-file.component';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, DownloadFileComponent],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
})
export class TaskManagementComponent implements OnInit {
  tasks: ProjectTask[] = [];
  ProjectTaskStatus = ProjectTaskStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.http
      .get<ProjectTask[]>(`Publisher/${this.user['publisherId']}/tasks`)
      .subscribe({
        next: (response: ProjectTask[]) => {
          this.tasks = response || [];
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }

  updateTaskStatus(task: ProjectTask): void {
    const nextStatus = this.getNextTaskStatus(task.status);

    this.http
      .post(`Publisher/${this.user['publisherId']}/tasks/update-status`, {
        taskId: task.projectTaskId,
        status: nextStatus,
      })
      .subscribe({
        next: () => {
          this.fetchTasks();
        },
        error: (error) => {
          console.error('Failed to update task status', error);
        },
      });
  }

  getNextTaskStatus(currentStatus: ProjectTaskStatus): ProjectTaskStatus {
    switch (currentStatus) {
      case ProjectTaskStatus.NotAssigned:
        return ProjectTaskStatus.Pending;
      case ProjectTaskStatus.Pending:
        return ProjectTaskStatus.InProgress;
      case ProjectTaskStatus.InProgress:
        return ProjectTaskStatus.Completed;
      default:
        return currentStatus;
    }
  }
}
