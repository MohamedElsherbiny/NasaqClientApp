import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowLeft,
  faStar,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
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
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="profile-view">
      <div class="profile-header">
        <div class="header-actions">
          <button class="back-btn" (click)="back.emit()">
            <fa-icon [icon]="faArrowLeft"></fa-icon>
            عودة
          </button>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-info">
          <div class="profile-avatar">
            <!-- <img [src]="freelancer.avatar" [alt]="freelancer.name"> -->
          </div>
          <div class="profile-details">
            <h2>{{ freelancer.companyName }}</h2>
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

        <div class="profile-section">
          <h3>نبذة عني</h3>
          <p class="bio">{{ freelancer.description || 'لا يوجد وصف متاح.' }}</p>
        </div>

        <!-- <div class="profile-section">
          <h3>الخدمات والأسعار</h3>
          <div class="services-grid">
            <div class="service-price-card" *ngFor="let service of freelancer.services">
              <span class="service-name">{{ getServiceLabel(service) }}</span>
              <span class="service-price">{{ freelancer.servicePrices?.[service] || '-' }} ريال</span>
            </div>
          </div>
        </div> -->

        <!-- <div class="profile-section">
          <h3>التقييمات</h3>
          <div class="evaluations-grid">
            <div class="evaluation-item">
              <span class="eval-label">التواصل</span>
              <div class="eval-stars">
                <fa-icon 
                  [icon]="faStar" 
                  *ngFor="let star of [1,2,3,4,5]"
                  [class.filled]="star <= (freelancer.evaluations?.communication || 0)"
                ></fa-icon>
              </div>
            </div>
            <div class="evaluation-item">
              <span class="eval-label">جودة العمل</span>
              <div class="eval-stars">
                <fa-icon 
                  [icon]="faStar" 
                  *ngFor="let star of [1,2,3,4,5]"
                  [class.filled]="star <= (freelancer.evaluations?.quality || 0)"
                ></fa-icon>
              </div>
            </div>
            <div class="evaluation-item">
              <span class="eval-label">الالتزام بالمواعيد</span>
              <div class="eval-stars">
                <fa-icon 
                  [icon]="faStar" 
                  *ngFor="let star of [1,2,3,4,5]"
                  [class.filled]="star <= (freelancer.evaluations?.timing || 0)"
                ></fa-icon>
              </div>
            </div>
          </div>
        </div> -->

        <div class="profile-actions">
          <button 
            class="invite-btn" 
            [class.invited]="freelancer.invited"
            (click)="invite.emit(freelancer)"
            [disabled]="freelancer.invited"
          >
            <fa-icon [icon]="faCheck" *ngIf="freelancer.invited"></fa-icon>
            {{ freelancer.invited ? 'تم إرسال الدعوة' : 'دعوة للمشروع' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-view {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .profile-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .header-actions {
      display: flex;
      justify-content: flex-start;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 1rem;
    }

    .back-btn:hover {
      background: var(--input-bg);
    }

    .profile-content {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
    }

    .profile-info {
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

    .profile-details h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-size: 1.5rem;
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

    .profile-section {
      margin-bottom: 2rem;
    }

    .profile-section h3 {
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

    .profile-actions {
      margin-top: 2rem;
      text-align: center;
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
  `]
})
export class FreelancerProfileComponent {
  @Input() freelancer!: Publisher;
  @Output() back = new EventEmitter<void>();
  @Output() invite = new EventEmitter<Publisher>();

  // Font Awesome icons
  faArrowLeft = faArrowLeft;
  faStar = faStar;
  faCheck = faCheck;

  availableServices = [
    { id: 'design', name: 'تصميم' },
    { id: 'publishing', name: 'نشر' },
    { id: 'auditing', name: 'تدقيق' },
    { id: 'translation', name: 'ترجمة' },
    { id: 'review', name: 'مراجعة محتوى' }
  ];

  getServiceLabel(serviceId: string): string {
    const service = this.availableServices.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  }
}