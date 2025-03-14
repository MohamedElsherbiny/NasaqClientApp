import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';
import { ToastrService } from 'ngx-toastr';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';

@Component({
  selector: 'app-task-item-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './task-item-editor.component.html',
  styleUrl: './task-item-editor.component.scss'
})
export class TaskItemEditorComponent {
  @Input() tasks: ProjectTask[] = [];
  @Input() projectTask: ProjectTask | null = null;
  @Input() projectId: number | null = null;
  @Input() hideAssignedTo: boolean | null = null;

  @Output() close = new EventEmitter<boolean>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  projectTaskForm: FormGroup;
  ProjectTaskStatus = ProjectTaskStatus;

  faTimes = faTimes;
  employees: PublisherEmployee[] = [];
  public get taskList(): ProjectTask[] {
    return this.tasks.filter(task => task.projectTaskId !== this.projectTask?.projectTaskId);
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private tostar: ToastrService
  ) {
    this.projectTaskForm = this.fb.group({
      taskName: ['', Validators.required],
      employeeId: [''],
      taskDescription: ['', Validators.required],
      predecessorId: [''],
      dueDate: [new Date().toISOString().split('T')[0]],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
    if (this.projectTask) {
      this.projectTaskForm.patchValue({
        taskName: this.projectTask.taskName,
        taskDescription: this.projectTask.taskDescription,
        employeeId: this.projectTask.assginTo?.employeeId,
        predecessorId: this.projectTask?.predecessorId,
        dueDate: this.projectTask.dueDate?.toString().split('T')[0],
      });
    }
  }

  onSubmit(): void {
    if (this.projectTaskForm.valid) {
      const formData = {
        projectId: this.projectId,
        taskId: this.projectTask?.projectTaskId,
        ...this.projectTaskForm.value,
        predecessorId: this.projectTaskForm.value.predecessorId == "null" ? null : this.projectTaskForm.value.predecessorId,
      };

      if (this.projectTask) {
        this.http.put(`Tasks`, formData).subscribe({
          next: () => {
            this.projectTaskForm.reset();
            this.close.emit(true);
            this.tostar.success('تم تحديث المهمة بنجاح', 'نجاح');
          }
        });
      } else {
        this.http.post(`Tasks`, formData).subscribe({
          next: () => {
            this.projectTaskForm.reset();
            this.onClose();
            this.close.emit(true);
            this.tostar.success('تم إضافة المهمة بنجاح', 'نجاح');
          }
        });
      }
    } else {
      this.tostar.error('الرجاء ملء جميع الحقول', 'خطأ');
    }
  }

  onClose() {
    this.close.emit();
  }

  getEmployees(): void {
    this.http.get<PublisherEmployee[]>(`Publisher/${this.user['publisherId']}/employees`).subscribe({
      next: (data) => {
        this.employees = data.filter(employee => !employee.isAdmin);
      }
    });
  }
}
