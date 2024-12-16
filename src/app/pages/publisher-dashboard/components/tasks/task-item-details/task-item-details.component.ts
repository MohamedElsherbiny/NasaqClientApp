import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';

@Component({
  selector: 'app-task-item-details',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './task-item-details.component.html',
  styleUrl: './task-item-details.component.scss'
})
export class TaskItemDetailsComponent {
  @Input() projectTask: ProjectTask | null = null;
  @Output() close = new EventEmitter<boolean>();
  projectId: number | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  projectTaskForm: FormGroup;
  ProjectTaskStatus = ProjectTaskStatus;
  faTimes = faTimes;
  employees: PublisherEmployee[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService
  ) {
    this.projectTaskForm = this.fb.group({
      taskName: ['', Validators.required],
      employeeId: [''],
      taskDescription: ['', Validators.required],
      requireAdminApproval: [''],
      dueDate: [new Date().toISOString().split('T')[0]],
    });
  }

  ngOnInit(): void {
    if (this.projectTask) {
      this.projectTaskForm.patchValue({
        taskName: this.projectTask.taskName,
        taskDescription: this.projectTask.taskDescription,
        requireAdminApproval: this.projectTask.requireAdminApproval,
        employeeId: this.projectTask.assginTo?.employeeId,
        dueDate: this.projectTask.dueDate?.toString().split('T')[0],
      });
    }
  }


  onClose() {
    this.close.emit();
  }


  updateTaskStatus(): void {
    const nextStatus = this.getNextTaskStatus(this.projectTask?.status!);

    this.http
      .post(`Publisher/${this.user['publisherId']}/tasks/update-status`, {
        taskId: this.projectTask?.projectTaskId,
        status: nextStatus,
      })
      .subscribe({
        next: () => {
          this.close.emit(true);
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
      this.uploadFile(file);
    } else {
      alert('Please select a valid Word document (.doc or .docx)');
    }
  }

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('formFile', file);
    formData.append('taskId', this.projectTask?.projectTaskId!.toString()!);

    this.http.post(`Publisher/${this.user['publisherId']}/tasks/upload-file`, formData).subscribe({
      next: (response) => {
        this.close.emit();
      },
      error: (error) => {
        console.error('Failed to upload file', error);
      },
    });
  }
}
