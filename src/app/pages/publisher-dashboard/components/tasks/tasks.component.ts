import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import {
  faPlus,
  faArrowUpWideShort,
  faCheck,
  faFilter,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskService } from '../shared/services/task.service';
import { ProjectTask } from '../../../../shared/models/ProjectTask';
import { ProjectService } from '../publisher-projects/projects.service';
import { Project } from '../../../../shared/models/Project';
import { filter } from 'rxjs';
import { TaskItemEditorComponent } from "./task-item-editor/task-item-editor.component";
import { TaskItemComponent } from "./task-item/task-item.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FontAwesomeModule,
    TaskItemEditorComponent,
    TaskItemComponent
  ],
  providers: [HttpService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasks: ProjectTask[] = [];
  showSortMenu = false;
  showFilterMenu = false;
  showForm = false;
  selectedTask: ProjectTask | null = null;

  // Font Awesome icons
  faPlus = faPlus;
  faFilter = faFilter;
  faArrowUpWideShort = faArrowUpWideShort;
  faCheck = faCheck;
  faCalendar = faCalendar;

  constructor(
    private http: HttpService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.projectService.selectedProjectId
      .pipe(filter((id) => !!id))
      .subscribe((projectId) => {
        this.fetchProject(projectId);
      });
  }

  fetchProject(selectedProjectId: number): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http
      .get<Project>(`Publisher/${user['publisherId']}/projects/${selectedProjectId}`)
      .subscribe({
        next: (response: Project) => {
          this.tasks = response.projectTasks || [];
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSortMenu = false;
      this.showFilterMenu = false;
    }
  }

  onAddTask(): void {
    this.selectedTask = null;
    this.showForm = true;
  }

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedTask = null;
    if (event) {
      this.fetchProject(this.projectService.selectedProjectId.value);
    }
  }

  toggleSortMenu(event: Event): void {
    event.stopPropagation();
    this.showSortMenu = !this.showSortMenu;
    this.showFilterMenu = false;
  }

  toggleFilterMenu(event: Event): void {
    event.stopPropagation();
    this.showFilterMenu = !this.showFilterMenu;
    this.showSortMenu = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const fromIndex = parseInt(event.dataTransfer!.getData('text/plain'));
    const elements = this.elementRef.nativeElement.querySelectorAll('.task-item');
    const toElement = (event.target as HTMLElement).closest('.task-item');
    if (!toElement) return;

    const toIndex = Array.from(elements).indexOf(toElement);
    if (fromIndex === toIndex) return;

    // Update the tasks array
    const tasks = [...this.tasks];
    const [removed] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, removed);
    this.tasks = tasks;

    this.reorderTasks(this.tasks.map((task, index) => ({ taskId: task.projectTaskId, sortOrder: index })));
  }

  reorderTasks(tasksToSort: { taskId: number | undefined; sortOrder: number; }[]) {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http
      .post(`Tasks/${user['publisherId']}/sort`, { tasks: tasksToSort })
      .subscribe({
        next: (response: any) => {
        },
        error: (error) => {
          console.error('Failed to sort tasks', error);
        },
      });
  }

  onEditTask(task: ProjectTask): void {
    this.showForm = true;
    this.selectedTask = task;
  }
}
