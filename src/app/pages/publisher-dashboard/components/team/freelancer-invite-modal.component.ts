import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FreelancerProfileComponent } from './freelancer-profile.component';
import {
  faTimes,
  faSearch,
  faFilter,
  faCheck,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Router } from '@angular/router';
import { Publisher } from '../../../../shared/models/Publisher';

interface FreelancerProfile {
  id: string;
  name: string;
  avatar: string;
  services: string[];
  rating: number;
  invited?: boolean;
  bio?: string;
  servicePrices?: { [key: string]: number };
  evaluations?: {
    communication: number;
    quality: number;
    timing: number;
    overall: number;
  };
}

@Component({
  selector: 'app-freelancer-invite-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatPaginatorModule, FreelancerProfileComponent],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ selectedFreelancer ? selectedFreelancer.companyName : 'دعوة من نسق' }}</h2>
          <button class="close-btn" (click)="close.emit()">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>

        <!-- Freelancer Profile View -->
        <app-freelancer-profile
          *ngIf="selectedFreelancer"
          [freelancer]="selectedFreelancer"
          (back)="closeProfile()"
          (invite)="inviteFreelancer($event)"
        ></app-freelancer-profile>

        <!-- Freelancers List View -->
        <ng-container *ngIf="!selectedFreelancer">
          <div class="search-filters">
            <div class="search-box">
              <fa-icon [icon]="faSearch"></fa-icon>
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="fetchPublishers()"
                placeholder="ابحث عن مقدم خدمة..."
              >
            </div>

            <div class="filters">
              <div class="filter-group">
                <label class="filter-option" *ngFor="let service of services">
                  <input 
                    type="checkbox"
                    [(ngModel)]="service.isSelected"
                    (ngModelChange)="fetchPublishers()"
                  >
                  {{ service.name }}
                </label>
              </div>
            </div>
          </div>

          <div class="freelancers-grid">
            <div class="freelancer-card" *ngFor="let freelancer of publishers">
              <div class="freelancer-header">
                <div class="freelancer-avatar">
                  <!-- <img [src]="freelancer.avatar" [alt]="freelancer.name"> -->
                  <div class="member-avatar" *ngIf="!freelancer.logoUrl">
                      {{ getInitials(freelancer.companyName) }}
                </div>
                </div>
                <div class="freelancer-info">
                  <h3 class="clickable" (click)="showProfile(freelancer)">{{ freelancer.companyName }}</h3>
                  <div class="rating">
                    <div class="stars">
                      <fa-icon 
                        [icon]="faStar" 
                        *ngFor="let star of [1,2,3,4,5]"
                        [class.filled]="star <= freelancer.rating"
                      ></fa-icon>
                    </div>
                    <span class="rating-value">{{ freelancer.rating }}/5</span>
                  </div>
                </div>
              </div>

              <div class="services-list">
                <span 
                  class="service-tag" 
                  *ngFor="let service of freelancer.serviceTypes"
                >{{ service.name }}</span>
              </div>

              <button 
                class="invite-btn" 
                [class.invited]="freelancer.invited"
                (click)="inviteFreelancer(freelancer)"
                [disabled]="freelancer.invited"
              >
                <fa-icon [icon]="faCheck" *ngIf="freelancer.invited"></fa-icon>
                {{ freelancer.invited ? 'تم إرسال الدعوة' : 'دعوة للمشروع' }}
              </button>
            </div>
          </div>

          <mat-paginator [length]="totalCount" [pageSize]="pageSize" (page)="onPageChange($event)" aria-label="اختر الصفحة"
              class="custom-paginator">
          </mat-paginator>

        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      width: 90vw;
      max-width: 1200px;
      max-height: 90vh;
      background: var(--bg-color);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.25rem;
    }
    .member-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--input-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .search-filters {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--input-bg);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      width: 300px;
    }

    .search-box input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-color);
      font-size: 0.95rem;
    }

    .search-box input::placeholder {
      color: var(--text-color);
      opacity: 0.5;
    }

    .filters {
      flex: 1;
    }

    .filter-group {
      display: flex;
      gap: 1.5rem;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color);
      cursor: pointer;
    }

    .filter-option input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .freelancers-grid {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      min-height: 0;
    }

    .freelancer-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
    }

    .freelancer-header {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .freelancer-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .freelancer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .freelancer-info {
      flex: 1;
      min-width: 0;
    }

    .freelancer-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .service-tag {
      background: var(--input-bg);
      color: var(--text-color);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      color: #f59e0b;
      font-size: 1.1rem;
      display: flex;
      gap: 0.25rem;
    }

    .stars fa-icon {
      opacity: 0.3;
    }

    .stars fa-icon.filled {
      opacity: 1;
    }

    .rating-value {
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .invite-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #4573d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .invite-btn:hover:not(:disabled) {
      background: #3b63b8;
    }

    .invite-btn.invited {
      background: #10b981;
      cursor: default;
    }

    .invite-btn:disabled {
      cursor: default;
    }

    
.custom-paginator {
    background: transparent;
    color: var(--text-color);
    border-top: 1px solid var(--border-color);
}

::ng-deep .custom-paginator {
    .mat-mdc-paginator-range-label,
    .mat-mdc-paginator-page-size-label {
        color: var(--text-color);
    }

    .mat-mdc-paginator-navigation-previous,
    .mat-mdc-paginator-navigation-next {
        color: var(--text-color);
    }

    .mat-mdc-select-value,
    .mat-mdc-select-arrow {
        color: var(--text-color);
    }

    .mat-mdc-paginator-page-size-select {
        margin: 0 4px;
    }
      .mat-mdc-select-value,
      .mat-mdc-select-arrow {
        color: var(--text-color);
      }

      .mat-mdc-select-trigger {
        background: var(--input-bg);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
      }

      .mat-mdc-paginator-page-size-select {
        margin: 0 4px;
      }
    }

    .clickable {
      cursor: pointer;
      transition: color 0.2s;
    }

    .clickable:hover {
      color: #4573d2;
    }

    @media (max-width: 768px) {
      .search-filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        width: 100%;
      }

      .filter-group {
        flex-wrap: wrap;
      }
    }
  `]
})
export class FreelancerInviteModalComponent {
  @Input() canInvitePublishers = false;
  @Output() close = new EventEmitter<void>();
  @Output() invite = new EventEmitter<Publisher>();

  faTimes = faTimes;
  faSearch = faSearch;
  faFilter = faFilter;
  faCheck = faCheck;
  faStar = faStar;

  searchQuery = '';
  selectedServices: { [key: number]: boolean } = {};
  totalCount = 0;
  pageSize = 3;
  currentPage = 0;
  selectedFreelancer: Publisher | null = null;
  services: any[] = [];
  displayedFreelancers: FreelancerProfile[] = [];
  publishers: Publisher[] = [];

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.fetchPublishers();
    this.getPublisherServiceTypes();
  }

  fetchPublishers(): void {
    this.http.get<any>(`Publisher`, {
      pageNumber: this.currentPage + 1,
      pageSize: this.pageSize,
      keyword: this.searchQuery,
      publisherType: this.canInvitePublishers ? null : 2,
      serviceTypes: this.services.filter(s => s.isSelected).map(s => s.value)
    }).subscribe({
      next: (data) => {
        this.publishers = data.items;
        this.totalCount = data.totalCount;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchPublishers();
  }

  inviteFreelancer(freelancer: Publisher): void {
    freelancer.invited = true;
    this.invite.emit(freelancer);
  }

  showProfile(freelancer: Publisher): void {
    this.selectedFreelancer = freelancer;
  }

  closeProfile(): void {
    this.selectedFreelancer = null;
  }

  private getPublisherServiceTypes() {
    this.http.get<any[]>(`Publisher/GetPublisherServiceTypes`).subscribe({
      next: (data) => {
        this.services = data;
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}