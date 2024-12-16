import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectTask } from '../../../../../shared/models/ProjectTask';
import { ProjectTaskStatus } from '../../../../../shared/models/ProjectTaskStatus';
import { faGripVertical, faCheck, faPen, faEllipsisVertical, faEye } from '@fortawesome/free-solid-svg-icons';
import { RoleService } from '../../../../../shared/core/services/role.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: ProjectTask;
  @Input() index!: number;
  @Output() editTaskEvent = new EventEmitter<ProjectTask>();
  @Output() viewDetailsEvent = new EventEmitter<ProjectTask>();
  ProjectTaskStatus = ProjectTaskStatus;
  showMenu = false;
  faGripVertical = faGripVertical;
  faCheck = faCheck;
  faPen = faPen;
  faEye = faEye;
  faEllipsisVertical = faEllipsisVertical;

  constructor(private http: HttpService, private elementRef: ElementRef, public roleService: RoleService) { }

  toggleMenu($event: MouseEvent) {
    $event.stopPropagation();
    this.showMenu = !this.showMenu;
  }
  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', this.index.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  toggleComplete() {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }

  editTask(task: ProjectTask) {
    this.editTaskEvent.emit(task);
  }

  viewDetails(task: ProjectTask) {
    this.viewDetailsEvent.emit(task);
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
