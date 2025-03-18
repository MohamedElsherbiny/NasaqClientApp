import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publisher-services-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="services-list">
      <div class="service-item" *ngFor="let service of services;">
        <div class="service-header">
          <label class="service-label">
            <input 
              type="checkbox" 
              [(ngModel)]="service.isSelected"
              (change)="onServiceChange()"
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
              (ngModelChange)="onServiceChange()"
            ></textarea>
          </div>

          <div class="form-group">
            <label>السعر</label>
            <input 
              type="number" 
              [(ngModel)]="service.price"
              placeholder="أدخل السعر"
              min="0"
              (ngModelChange)="onServiceChange()"
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.service-item {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
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
    }`
  ]
})
export class PublisherServicesFormComponent {
  @Input() services: any[] = [];
  @Output() servicesChange = new EventEmitter<any[]>();

  onServiceChange() {
    this.servicesChange.emit(this.services);
  }
}