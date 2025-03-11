import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-publisher-services-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="settings-overlay" (click)="close.emit()">
      <div class="settings-flyout" (click)="$event.stopPropagation()">
        <div class="settings-header">
          <h2>إعدادات الخدمات</h2>
          <button class="close-btn" (click)="close.emit()">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>

        <div class="settings-content">
          <div class="services-list">
            <div class="service-item" *ngFor="let service of services;">
              <div class="service-header">
                <label class="service-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="service.isSelected"
                  >
                  {{ service.name }}
                </label>
              </div>

              <div class="service-details" *ngIf="service.isSelected">
                <div class="form-group">
                  <label>الوصف</label>
                  <textarea 
                    [(ngModel)]="service.description"
                    rows="3"
                    placeholder="أدخل وصف الخدمة"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>السعر</label>
                  <input 
                    type="number" 
                    [(ngModel)]="service.price"
                    placeholder="أدخل السعر"
                    min="0"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <button class="cancel-btn" (click)="close.emit()">إلغاء</button>
          <button class="save-btn" (click)="saveServices()">حفظ</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-overlay {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: flex-start;
      z-index: 1000;
    }

    .settings-flyout {
      width: 35vw;
      height: 100vh;
      background: var(--bg-color);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }

    .settings-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .settings-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--text-color);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.25rem;
    }

    .settings-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .service-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    .service-header {
      margin-bottom: 1rem;
    }

    .service-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-color);
      cursor: pointer;
    }

    .service-details {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-bg);
      color: var(--text-color);
    }

    .form-group textarea {
      resize: vertical;
    }

    .settings-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .cancel-btn,
    .save-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .cancel-btn {
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-color);
    }

    .save-btn {
      background: #4573d2;
      border: none;
      color: white;
    }

    .save-btn:hover {
      background: #3b63b8;
    }
  `]
})
export class PublisherServicesEditorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  publisher: any = {};
  faTimes = faTimes;
  services: any[] = [];

  constructor(private http: HttpService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.getPublisherServiceTypes();
    this.loadPublisherData();
  }

  private getPublisherServiceTypes() {
    this.http.get<any[]>(`Publisher/GetPublisherServiceTypes`).subscribe({
      next: (data) => {
        this.services = data;
      }
    });
  }

  private loadPublisherData(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.get<any>(`Publisher/${user['publisherId']}`).subscribe({
      next: (data) => {
        this.setSelectedServiceTypes(data);
        this.publisher = data;
      }
    });
  }

  private setSelectedServiceTypes(data: any) {
    if (data.serviceTypes && data.serviceTypes.length > 0) {
      data.serviceTypes.forEach((service: { serviceTypeId: number; price: number; description: string; }) => {
        let publisherService = this.services.find(s => s.value === service.serviceTypeId);
        if (publisherService) {
          publisherService.isSelected = true;
          publisherService.price = service.price;
          publisherService.description = service.description;
        }
      });
    }
  }
  saveServices() {
    const selectedServices = this.services.filter(s => s.isSelected);

    const payload = {
      ...this.publisher,
      serviceTypes: selectedServices.map(s => ({
        serviceTypeId: s.value,
        price: s.price,
        description: s.description
      }))
    };

    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.put(`Publisher/${user['publisherId']}`, payload).subscribe({
      next: () => {
        this.toastr.success('تم حفظ التغييرات بنجاح', 'نجاح');
      },
      error: (error) => {
        console.error('فشل في حفظ التغييرات', error);
        this.toastr.error('فشل في حفظ التغييرات، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
  }
}