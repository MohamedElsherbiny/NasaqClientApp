import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTasks,
  faUsers,
  faStarHalf,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import { TeamListComponent } from '../team/team-list.component';
import { TasksComponent } from "../tasks/tasks.component";
import { ActivatedRoute } from '@angular/router';
import { ProjectEvaluationComponent } from "../evaluation/project-evaluation/project-evaluation.component";
import { OnixFormComponent } from "../../../author-dashboard/components/project/onix-form/onix-form.component";

@Component({
  selector: 'app-publisher-project',
  standalone: true,
  imports: [
    CommonModule,
    TeamListComponent,
    FontAwesomeModule,
    TasksComponent,
    ProjectEvaluationComponent,
    OnixFormComponent
  ],
  template: `
    <div class="publisher-project-page">
      <div class="publisher-project-content">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'tasks'"
            (click)="activeTab = 'tasks'"
          >
            <fa-icon [icon]="faTasks"></fa-icon>
            المهام
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'team'"
            (click)="activeTab = 'team'"
          >
            <fa-icon [icon]="faUsers"></fa-icon>
            الفريق
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'evaluation'"
            (click)="activeTab = 'evaluation'"
          >
            <fa-icon [icon]="faStarHalf"></fa-icon>
            التقييم
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'onix'"
            (click)="activeTab = 'onix'"
          >
            <fa-icon [icon]="faBook"></fa-icon>
            ONIX
          </button>
        </div>

        <div class="tab-content">
          <app-team-list *ngIf="activeTab === 'team'"></app-team-list>
          <app-tasks  *ngIf="activeTab === 'tasks'" [projectId]="projectId"></app-tasks>
          <app-evaluation [projectId]="projectId" *ngIf="activeTab === 'evaluation'"></app-evaluation>
           <app-onix-form *ngIf="activeTab === 'onix'"></app-onix-form>
          </div>
      </div>
    </div>
  `,
  styles: [`
    .publisher-project-page {
      padding: 2rem;
      background: var(--bg-color);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .publisher-project-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 1rem 2rem;
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      font-size: 1rem;
      position: relative;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .tab-btn::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #4573d2;
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    .tab-btn.active {
      color: #4573d2;
    }

    .tab-btn.active::after {
      transform: scaleX(1);
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .publisher-project-page {
        padding: 1rem;
      }

      .tabs {
        gap: 0.5rem;
      }

      .tab-btn {
        padding: 0.75rem 1rem;
      }
    }
  `]
})
export class PublisherProjectComponent {
  activeTab: 'tasks' | 'team' | 'evaluation' | 'onix' = 'tasks';
  projectId: number | null = null;

  faTasks = faTasks;
  faUsers = faUsers;
  faStarHalf = faStarHalf;
  faBook = faBook;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
    });
  }
}