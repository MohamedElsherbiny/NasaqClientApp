import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEllipsisVertical, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
}

@Component({
  selector: 'app-contract-templates',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="templates-container">
      <div class="templates-header">
        <button class="add-btn" (click)="onAddTemplate()">
          <fa-icon [icon]="faPlus"></fa-icon>
          إضافة قالب
        </button>
      </div>

      <div class="templates-list">
        <div class="template-card" *ngFor="let template of templates">
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <span class="last-modified">
              آخر تعديل: {{ template.lastModified | date:'yyyy/MM/dd' }}
            </span>
          </div>
          
          <div class="template-actions">
            <button class="action-btn" (click)="editTemplate(template)">
              <fa-icon [icon]="faPen"></fa-icon>
            </button>
            <button class="action-btn" (click)="deleteTemplate(template)">
              <fa-icon [icon]="faTrash"></fa-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .templates-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .templates-header {
      margin-bottom: 2rem;
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #4573d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .add-btn:hover {
      background: #3b63b8;
    }

    .templates-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .template-card {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .template-info {
      flex: 1;
      min-width: 0;
    }

    .template-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-size: 1.1rem;
    }

    .template-info p {
      margin: 0 0 1rem 0;
      color: var(--text-color);
      opacity: 0.8;
      font-size: 0.95rem;
    }

    .last-modified {
      color: var(--text-color);
      opacity: 0.6;
      font-size: 0.85rem;
    }

    .template-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      opacity: 0.7;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: var(--input-bg);
      opacity: 1;
    }

    @media (max-width: 768px) {
      .templates-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContractTemplatesComponent {
  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;

  templates: ContractTemplate[] = [
    {
      id: '1',
      name: 'عقد تأليف كتاب',
      description: 'قالب عقد موحد لتأليف الكتب مع الناشرين',
      lastModified: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'عقد ترجمة',
      description: 'قالب عقد لترجمة الكتب والمؤلفات',
      lastModified: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'عقد نشر إلكتروني',
      description: 'قالب عقد للنشر الإلكتروني والتوزيع الرقمي',
      lastModified: new Date('2024-01-05')
    }
  ];

  onAddTemplate() {
    // TODO: Implement add template logic
    console.log('Add template clicked');
  }

  editTemplate(template: ContractTemplate) {
    // TODO: Implement edit template logic
    console.log('Edit template:', template);
  }

  deleteTemplate(template: ContractTemplate) {
    // TODO: Implement delete template logic
    console.log('Delete template:', template);
  }
}