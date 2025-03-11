import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTasks,
  faUsers,
  faStarHalf
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { TasksComponent } from "../../../publisher-dashboard/components/tasks/tasks.component";
import { ProjectEvaluationComponent } from "../../../publisher-dashboard/components/evaluation/project-evaluation/project-evaluation.component";
import { TeamListComponent } from "../../../publisher-dashboard/components/team/team-list.component";

@Component({
  selector: 'app-author-project',
  standalone: true,
  imports: [
    CommonModule,
    // TeamListComponent,
    FontAwesomeModule,
    TasksComponent,
    ProjectEvaluationComponent,
    TeamListComponent
  ],
  template: `
    <div class="author-project-page">
      <div class="author-project-content">
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
        </div>

        <div class="tab-content">
          <app-tasks [hideAssignedTo]="true"  *ngIf="activeTab === 'tasks'" [projectId]="projectId" [hideAssignedTo]="true"></app-tasks>
          <app-team-list [canInvitePublishers]="true" *ngIf="activeTab === 'team'" [projectId]="projectId" ></app-team-list>
          <app-evaluation [projectId]="projectId" *ngIf="activeTab === 'evaluation'"></app-evaluation>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .author-project-page {
      padding: 2rem;
      background: var(--bg-color);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .author-project-content {
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
      .author-project-page {
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
export class AuthorProjectComponent {
  activeTab: 'tasks' | 'team' | 'evaluation' = 'tasks';
  projectId: number | null = null;

  faTasks = faTasks;
  faUsers = faUsers;
  faStarHalf = faStarHalf;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
    });
  }
}