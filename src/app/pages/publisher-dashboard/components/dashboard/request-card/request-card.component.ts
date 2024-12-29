import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { BookRequest } from '../../../../../shared/models/BookRequest';

@Component({
    selector: 'app-request-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="request-card">
      <h2>آخر الطلبات</h2>
      <div class="activity-list">
        <div class="activity-item" *ngFor="let request of requests; let i = index">
          <div class="activity-dot" [style.background]="colors[i]"></div>
          <div class="activity-content">
            <p>{{ request.bookName }}</p>
            <!-- <span class="activity-time">{{ requests.time }}</span> -->
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .request-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .activity-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 0.25rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      color: var(--text-color);
      margin-bottom: 0.25rem;
    }

    .activity-time {
      font-size: 0.85rem;
      color: var(--text-color);
      opacity: 0.7;
    }
  `]
})
export class RequestCardComponent implements OnInit {
    requests: BookRequest[] = [];
    colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

    constructor(private http: HttpService) { }

    ngOnInit(): void {
        this.fetchRequests();
    }

    fetchRequests(): void {
        const user = JSON.parse(localStorage.getItem('user') ?? '{}');
        this.http.get(`Publisher/${user['publisherId']}/requests`).subscribe({
            next: (response: any) => {
                this.requests = response?.slice(0, 4) || [];
            },
            error: (error) => {
                console.error('Failed to fetch requests', error);
            }
        });
    }
}