import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PublisherEmployee } from '../../../../shared/models/PublisherEmployee';

interface InviteData {
  emails: string[];
  role: string;
  services: string[];
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2> التخصص</h2>
          <button class="close-btn" (click)="close.emit()">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="member-role" *ngFor="let role of employee!.roles">
            {{ role.name }}
          </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="close.emit()">إغلاق</button>
        </div>
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
      width: 100%;
      max-width: 480px;
      background: var(--bg-color);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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

    .modal-body {
      padding: 1.5rem;
    }

    .member-role {
      padding: 0.35rem 0.75rem;
      background: var(--input-bg);
      border-radius: 4px;
      color: var(--text-color);
      font-size: 0.9rem;
    }
    
    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .btn-secondary {
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-color);
    }

    .btn-secondary:hover {
      background: var(--input-bg);
    }

    .btn-primary {
      background: #4573d2;
      border: none;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #3b63b8;
    }

    .btn-primary:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
  `]
})
export class EmployeeDetailsComponent {
  @Input() employee: PublisherEmployee | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() invite = new EventEmitter<InviteData>();

  faTimes = faTimes;

  formData = {
    role: 'editor',
    services: [] as string[]
  };

  emailInput = '';
  selectedEmails: string[] = [];

  get canInvite(): boolean {
    return this.selectedEmails.length > 0;
  }

  addEmail() {
    if (this.isValidEmail(this.emailInput) && !this.selectedEmails.includes(this.emailInput)) {
      this.selectedEmails.push(this.emailInput);
      this.emailInput = '';
    }
  }

  removeEmail(index: number) {
    this.selectedEmails.splice(index, 1);
  }

  onInvite() {
    if (this.selectedEmails.length > 0) {
      this.invite.emit({
        emails: this.selectedEmails,
        role: this.formData.role,
        services: this.formData.services
      });
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}