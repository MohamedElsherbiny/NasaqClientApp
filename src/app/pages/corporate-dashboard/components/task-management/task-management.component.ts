import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  tasks: ProjectTask[] = [];
  ProjectTaskStatus = ProjectTaskStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedTaskId: number | null = null;

  constructor(private http: HttpService) { }

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

  onFileSelected(event: any, taskId: number): void {
    const file: File = event.target.files[0];

    if (file && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      this.selectedTaskId = taskId;
      this.uploadFile(file);
    } else {
      alert('Please select a valid Word document (.doc or .docx)');
    }
  }

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('formFile', file);
    formData.append('taskId', this.selectedTaskId!.toString());

    this.http.post(`Publisher/${this.user['publisherId']}/tasks/upload-file`, formData).subscribe({
      next: (response) => {
        console.log('File uploaded successfully', response);
        this.fetchTasks();
      },
      error: (error) => {
        console.error('Failed to upload file', error);
      },
    });
  }
}
