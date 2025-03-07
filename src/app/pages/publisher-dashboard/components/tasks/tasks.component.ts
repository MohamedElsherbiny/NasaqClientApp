import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import {
  faPlus,
  faArrowUpWideShort,
  faCheck,
  faFilter,
  faCalendar,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectTask } from '../../../../shared/models/ProjectTask';
import { ProjectService } from '../publisher-projects/projects.service';
import { Project } from '../../../../shared/models/Project';
import { filter } from 'rxjs';
import { TaskItemEditorComponent } from "./task-item-editor/task-item-editor.component";
import { TaskItemComponent } from "./task-item/task-item.component";
import { TaskItemDetailsComponent } from "./task-item-details/task-item-details.component";
import { RoleService } from '../../../../shared/core/services/role.service';
import { BookDocumentsComponent } from "../../../../shared/components/book-documents/book-documents.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FontAwesomeModule,
    TaskItemEditorComponent,
    TaskItemComponent,
    TaskItemDetailsComponent,
    BookDocumentsComponent,
    FormsModule
  ],
  providers: [HttpService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  @Input() projectId: number | null = null;

  tasks: ProjectTask[] = [];
  showSortMenu = false;
  showFilterMenu = false;
  showForm = false;
  showDetails = false;
  selectedTask: ProjectTask | null = null;
  selectedProject: Project | null = null;
  showDocuments = false;
  selectedProjectId: number | null = null;

  // Font Awesome icons
  faPlus = faPlus;
  faFilter = faFilter;
  faArrowUpWideShort = faArrowUpWideShort;
  faCheck = faCheck;
  faCalendar = faCalendar;
  faDownload = faDownload;
  projects: Project[] = [];

  constructor(
    private http: HttpService,
    private projectService: ProjectService,
    private elementRef: ElementRef,
    public roleService: RoleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      this.fetchProject(this.projectId!);
    });

    // console.log(this.projectId);
    // this.projectService.getProjects().subscribe(
    //   projects => {
    //     this.projects = projects;
    //     this.selectedProjectId = projects[0]?.projectId;
    //     if (this.selectedProjectId) {
    //     }
    //   }
    // );
  }

  fetchProject(selectedProjectId: number): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http
      .get<Project>(`Publisher/${user['publisherId']}/projects/${selectedProjectId}`)
      .subscribe({
        next: (response: Project) => {
          this.tasks = response.projectTasks || [];
          this.selectedProject = response;
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

  closeDetails(event: boolean): void {
    this.showDetails = false;
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
        next: () => {
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

  onViewDetails(task: ProjectTask) {
    this.showDetails = true;
    this.selectedTask = task;
  }

  closeDocuments() {
    this.showDocuments = false;
  }
  openDocuments() {
    this.showDocuments = true;
  }

  toggleProjectSelector($event: any) {
    this.projectService.setSelectedProjectId($event.target.value);
  }
}
