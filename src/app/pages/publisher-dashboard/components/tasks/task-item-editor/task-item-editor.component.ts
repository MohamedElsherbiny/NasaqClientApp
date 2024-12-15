import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';
import { ProjectService } from '../../publisher-projects/projects.service';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';

@Component({
  selector: 'app-task-item-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './task-item-editor.component.html',
  styleUrl: './task-item-editor.component.scss'
})
export class TaskItemEditorComponent {
  @Input() projectTask: ProjectTask | null = null;
  @Output() close = new EventEmitter<boolean>();
  projectId: number | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  projectTaskForm: FormGroup;

  faTimes = faTimes;
  employees: PublisherEmployee[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private projectsService: ProjectService
  ) {
    this.projectTaskForm = this.fb.group({
      taskName: ['', Validators.required],
      employeeId: [''],
      taskDescription: ['', Validators.required],
      requireAdminApproval: ['', [Validators.required]],
      dueDate: [new Date().toISOString().split('T')[0]],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
    if (this.projectTask) {
      this.projectTaskForm.patchValue({
        taskName: this.projectTask.taskName,
        taskDescription: this.projectTask.taskDescription,
        requireAdminApproval: this.projectTask.requireAdminApproval,
        employeeId: this.projectTask.assginTo?.employeeId,
        dueDate: this.projectTask.dueDate?.toString().split('T')[0],
      });
    }

    this.projectsService?.selectedProjectId.subscribe((projectId) => { this.projectId = projectId });
  }

  onSubmit(): void {
    if (this.projectTaskForm.valid) {
      const formData = {
        projectId: this.projectId,
        taskId: this.projectTask?.projectTaskId,
        ...this.projectTaskForm.value
      };

      if (this.projectTask) {
        this.http.put(`Tasks/${this.user['publisherId']}`, formData).subscribe({
          next: () => {
            this.projectTaskForm.reset();
            this.close.emit(true);
          },
          error: (error) => {
          }
        });
      } else {
        this.http.post(`Tasks/${this.user['publisherId']}`, formData).subscribe({
          next: () => {
            this.projectTaskForm.reset();
            this.onClose();
            this.close.emit(true);
          },
          error: (error) => {
          }
        });
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  getEmployees(): void {
    this.http.get<PublisherEmployee[]>(`Publisher/${this.user['publisherId']}/employees`).subscribe({
      next: (data) => {
        this.employees = data.filter(employee => !employee.isAdmin);
      },
      error: (error) => {
        // this.toastr.error('فشل في تحميل قائمة الموظفين، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
  }
}
