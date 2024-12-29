import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faProjectDiagram,
    faCheckCircle,
    faBook,
    faStar
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-metrics-card',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    template: `
    <div class="metric-card">
      <div class="metric-icon">
        <fa-icon [icon]="getIcon()"></fa-icon>
      </div>
      <div class="metric-content">
        <h3>{{ title }}</h3>
        <div class="metric-value">{{ value }}</div>
        <!-- <div class="metric-trend" [class.positive]="isPositive()">
          {{ trend }}
        </div> -->
      </div>
    </div>
  `,
    styles: [`
    .metric-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-2px);
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      background: var(--input-bg);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4573d2;
      font-size: 1.5rem;
    }

    .metric-content h3 {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.7;
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.25rem;
    }

    .metric-trend {
      font-size: 0.9rem;
      color: #ef4444;
    }

    .metric-trend.positive {
      color: #10b981;
    }
  `]
})
export class MetricsCardComponent {
    @Input() title!: string;
    @Input() value!: string;
    // @Input() trend!: string;
    @Input() icon!: 'project' | 'task' | 'book' | 'star';

    private icons = {
        project: faProjectDiagram,
        task: faCheckCircle,
        book: faBook,
        star: faStar
    };

    getIcon() {
        return this.icons[this.icon];
    }

    // isPositive() {
    //     return this.trend.startsWith('+');
    // }
}