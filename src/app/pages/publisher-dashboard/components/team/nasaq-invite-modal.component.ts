import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { 
  faTimes, 
  faSearch, 
  faFilter,
  faCheck,
  faStar,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Router } from '@angular/router';
import { Publisher } from '../../../../shared/models/Publisher';

interface NasaqFreelancer {
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
  selector: 'app-nasaq-invite-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatPaginatorModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ selectedFreelancer ? selectedFreelancer.name : 'دعوة من نسق' }}</h2>
          <div class="header-actions">
            <button class="back-btn" *ngIf="selectedFreelancer" (click)="closeProfile()">
              <fa-icon [icon]="faArrowLeft"></fa-icon>
              عودة
            </button>
            <button class="close-btn" (click)="close.emit()">
              <fa-icon [icon]="faTimes"></fa-icon>
            </button>
          </div>
        </div>

        <!-- Freelancer Profile View -->
        <div class="profile-view" *ngIf="selectedFreelancer">
          <div class="profile-header">
            <div class="profile-avatar">
              <img [src]="selectedFreelancer.avatar" [alt]="selectedFreelancer.name">
            </div>
            <div class="profile-info">
              <h3>{{ selectedFreelancer.name }}</h3>
              <div class="rating">
                <div class="stars">
                  <fa-icon 
                    [icon]="faStar" 
                    *ngFor="let star of [1,2,3,4,5]"
                    [class.filled]="star <= selectedFreelancer.rating"
                  ></fa-icon>
                </div>
                <span class="rating-value">{{ selectedFreelancer.rating }}/5</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4>نبذة عني</h4>
            <p class="bio">{{ selectedFreelancer.bio }}</p>
          </div>

          <div class="profile-section">
            <h4>الخدمات والأسعار</h4>
            <div class="services-grid">
              <div class="service-price-card" *ngFor="let service of selectedFreelancer.services">
                <span class="service-name">{{ getServiceLabel(service) }}</span>
                <span class="service-price">{{ selectedFreelancer.servicePrices?.[service] }} ريال</span>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h4>التقييمات</h4>
            <div class="evaluations-grid">
              <div class="evaluation-item">
                <span class="eval-label">التواصل</span>
                <div class="eval-stars">
                  <fa-icon 
                    [icon]="faStar" 
                    *ngFor="let star of [1,2,3,4,5]"
                    [class.filled]="star <= (selectedFreelancer?.evaluations?.communication || 0)"
                  ></fa-icon>
                </div>
              </div>
              <div class="evaluation-item">
                <span class="eval-label">جودة العمل</span>
                <div class="eval-stars">
                  <fa-icon 
                    [icon]="faStar" 
                    *ngFor="let star of [1,2,3,4,5]"
                    [class.filled]="star <= (selectedFreelancer?.evaluations?.quality || 0)"
                  ></fa-icon>
                </div>
              </div>
              <div class="evaluation-item">
                <span class="eval-label">الالتزام بالمواعيد</span>
                <div class="eval-stars">
                  <fa-icon 
                    [icon]="faStar" 
                    *ngFor="let star of [1,2,3,4,5]"
                    [class.filled]="star <= (selectedFreelancer?.evaluations?.timing || 0)"
                  ></fa-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button 
              class="invite-btn" 
              [class.invited]="selectedFreelancer.invited"
              (click)="inviteFreelancer(selectedFreelancer)"
              [disabled]="selectedFreelancer.invited"
            >
              <fa-icon [icon]="faCheck" *ngIf="selectedFreelancer.invited"></fa-icon>
              {{ selectedFreelancer.invited ? 'تم إرسال الدعوة' : 'دعوة للمشروع' }}
            </button>
          </div>
        </div>

        <!-- Freelancers List View -->
        <ng-container *ngIf="!selectedFreelancer">
          <div class="search-filters">
            <div class="search-box">
              <fa-icon [icon]="faSearch"></fa-icon>
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="filterFreelancers()"
                placeholder="ابحث عن مقدم خدمة..."
              >
            </div>

            <div class="filters">
              <div class="filter-group">
                <label class="filter-option" *ngFor="let service of availableServices">
                  <input 
                    type="checkbox"
                    [(ngModel)]="selectedServices[service.id]"
                    (ngModelChange)="filterFreelancers()"
                  >
                  {{ service.name }}
                </label>
              </div>
            </div>
          </div>

          <div class="freelancers-grid">
            <div class="freelancer-card" *ngFor="let freelancer of displayedFreelancers">
              <div class="freelancer-header">
                <div class="freelancer-avatar">
                  <img [src]="freelancer.avatar" [alt]="freelancer.name">
                </div>
                <div class="freelancer-info">
                  <h3 (click)="showProfile(freelancer)">{{ freelancer.name }}</h3>
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
                  *ngFor="let service of freelancer.services"
                >{{ getServiceLabel(service) }}</span>
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

          <mat-paginator
            [length]="filteredFreelancers.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 15, 20, 25]"
            (page)="onPageChange($event)"
            aria-label="اختر الصفحة"
          >
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

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .back-btn,
    .close-btn {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 4px;
    }

    .back-btn:hover,
    .close-btn:hover {
      background: var(--input-bg);
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
      padding: 1.5rem;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.5rem;
    }

    .freelancer-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
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
    }

    .freelancer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .freelancer-info {
      flex: 1;
    }

    .freelancer-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-size: 1.1rem;
      cursor: pointer;
    }

    .freelancer-info h3:hover {
      color: #4573d2;
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

    .profile-actions {
      text-align: center;
      margin-top: 2rem;
    }

    .invite-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      min-width: 160px;
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

    .invite-btn.full-width {
      width: 100%;
      margin-top: 2rem;
    }

    /* Profile View Styles */
    .profile-view {
      padding: 1.5rem;
      overflow-y: auto;
    }

    .profile-header {
      display: flex;
      gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: var(--text-color);
    }

    .profile-section {
      margin-bottom: 2rem;
    }

    .profile-section h4 {
      color: var(--text-color);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .bio {
      color: var(--text-color);
      line-height: 1.6;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .service-price-card {
      background: var(--input-bg);
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .service-name {
      color: var(--text-color);
    }

    .service-price {
      color: #10b981;
      font-weight: 500;
    }

    .evaluations-grid {
      display: grid;
      gap: 1rem;
    }

    .evaluation-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--input-bg);
      border-radius: 8px;
    }

    .eval-label {
      color: var(--text-color);
    }

    .eval-stars {
      display: flex;
      gap: 0.25rem;
    }

    @media (max-width: 1600px) {
      .freelancers-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 1200px) {
      .freelancers-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 992px) {
      .freelancers-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .freelancers-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NasaqInviteModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() invite = new EventEmitter<NasaqFreelancer>();

  // Font Awesome icons
  faTimes = faTimes;
  faSearch = faSearch;
  faFilter = faFilter;
  faCheck = faCheck;
  faStar = faStar;
  faArrowLeft = faArrowLeft;

  searchQuery = '';
  selectedServices: { [key: string]: boolean } = {};
  pageSize = 15;
  currentPage = 0;
  selectedFreelancer: NasaqFreelancer | null = null;
  publishers: Publisher[] = [];

  availableServices = [
    { id: 'design', name: 'تصميم' },
    { id: 'publishing', name: 'نشر' },
    { id: 'auditing', name: 'تدقيق' },
    { id: 'translation', name: 'ترجمة' },
    { id: 'review', name: 'مراجعة محتوى' }
  ];

  freelancers: NasaqFreelancer[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      avatar: 'https://i.pravatar.cc/150?img=1',
      services: ['design', 'publishing'],
      rating: 4.8,
      bio: 'مصمم جرافيك محترف مع خبرة 8 سنوات في مجال تصميم الكتب والمجلات. حاصل على شهادة في التصميم الجرافيكي وعملت مع العديد من دور النشر المرموقة.',
      servicePrices: {
        design: 500,
        publishing: 1000
      },
      evaluations: {
        communication: 5,
        quality: 4.8,
        timing: 4.7,
        overall: 4.8
      }
    },
    {
      id: '2',
      name: 'سارة خالد',
      avatar: 'https://i.pravatar.cc/150?img=2',
      services: ['auditing', 'review'],
      rating: 4.5,
      bio: 'مدققة لغوية ومراجعة محتوى مع خبرة 5 سنوات. متخصصة في تدقيق الكتب الأدبية والعلمية. حاصلة على شهادة في اللغة العربية.',
      servicePrices: {
        auditing: 300,
        review: 400
      },
      evaluations: {
        communication: 4.5,
        quality: 4.6,
        timing: 4.4,
        overall: 4.5
      }
    },
    {
      id: '3',
      name: 'محمد عبدالله',
      avatar: 'https://i.pravatar.cc/150?img=3',
      services: ['translation', 'review'],
      rating: 4.9,
      bio: 'مترجم محترف مع خبرة 10 سنوات في الترجمة الأدبية والتقنية. أتقن اللغة الإنجليزية والفرنسية والعربية. عملت على ترجمة أكثر من 50 كتاباً.',
      servicePrices: {
        translation: 800,
        review: 400
      },
      evaluations: {
        communication: 4.9,
        quality: 4.9,
        timing: 4.8,
        overall: 4.9
      }
    }
  ];

  filteredFreelancers: NasaqFreelancer[] = this.freelancers;
  displayedFreelancers: NasaqFreelancer[] = [];
  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    alert('hello')
    // this.updateDisplayedFreelancers();
    this.fetchPublishers();
  }
  fetchPublishers(): void {
    this.http.get<any>(`Publisher`, {
      pageNumber: this.currentPage + 1,
      pageSize: this.pageSize,
      keyword: this.searchQuery,
      publisherType: 2
    }).subscribe({
      next: (data) => {
        this.publishers = data;
        console.log(this.publishers) 
      }
    });
  }
  filterFreelancers(): void {
    let filtered = [...this.freelancers];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(freelancer => 
        freelancer.name.toLowerCase().includes(query)
      );
    }

    const selectedServices = Object.entries(this.selectedServices)
      .filter(([_, selected]) => selected)
      .map(([service]) => service);

    if (selectedServices.length > 0) {
      filtered = filtered.filter(freelancer => 
        selectedServices.every(service => freelancer.services.includes(service))
      );
    }

    this.filteredFreelancers = filtered;
    this.currentPage = 0;
    this.updateDisplayedFreelancers();
  }

  updateDisplayedFreelancers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedFreelancers = this.filteredFreelancers.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedFreelancers();
  }

  getServiceLabel(serviceId: string): string {
    const service = this.availableServices.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  }

  inviteFreelancer(freelancer: NasaqFreelancer): void {
    freelancer.invited = true;
    this.invite.emit(freelancer);
  }

  showProfile(freelancer: NasaqFreelancer): void {
    this.selectedFreelancer = freelancer;
  }

  closeProfile(): void {
    this.selectedFreelancer = null;
  }
}

// export { NasaqInviteModalComponent }