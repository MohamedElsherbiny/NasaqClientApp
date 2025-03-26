import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel, faSave } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Route } from '@angular/router';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { Project } from '../../shared/models/project.model';

interface OnixData {
  title: string;
  author: string | string[];
  publisher: string;
  publicationDate: string;
  isbn: string;
  format: string;
  pages: number;
  language: string;
  subjects: string[];
  description: string;
  isArabic: boolean;
}

@Component({
  selector: 'app-onix-form',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="onix-form">
      <div class="form-actions">
        <button class="save-btn" (click)="saveForm()">
          <fa-icon [icon]="faSave"></fa-icon>
          حفظ
        </button>
        <button class="export-btn" (click)="exportToExcel()">
          <fa-icon [icon]="faFileExcel"></fa-icon>
          تصدير إلى Excel
        </button>
      </div>

      <div class="form-content">
        <div class="form-group">
          <label>عنوان الكتاب</label>
          <input 
            type="text" 
            [(ngModel)]="formData.title"
            maxlength="1000"
            placeholder="أدخل عنوان الكتاب (مطلوب)"
          >
        </div>

        <div class="form-group">
          <label>المؤلف</label>
          <input 
            type="text" 
            [(ngModel)]="formData.author"
            placeholder="أدخل اسم المؤلف"
           readonly
          >
        </div>

        <div class="form-group">
          <label>الناشر</label>
          <input 
            type="text" 
            [(ngModel)]="formData.publisher"
            placeholder="أدخل اسم الناشر"
           readonly
          >
        </div>

        <div class="form-group">
          <label>تاريخ النشر</label>
          <input 
            type="date" 
            [(ngModel)]="formData.publicationDate"
          >
        </div>

        <div class="form-group">
          <label>ISBN</label>
          <input 
            type="text" 
            [(ngModel)]="formData.isbn"
            maxlength="13"
            placeholder="أدخل رقم ISBN (13 رقم)"
          >
        </div>

        <div class="form-group">
          <label>التنسيق</label>
          <select [(ngModel)]="formData.format">
            <option value="BA">غلاف ورقي</option>
            <option value="BB">غلاف صلب</option>
            <option value="EB">كتاب إلكتروني</option>
          </select>
        </div>

        <div class="form-group">
          <label>عدد الصفحات</label>
          <input 
            type="number" 
            [(ngModel)]="formData.pages"
            min="1"
            placeholder="أدخل عدد الصفحات"
          >
        </div>

        <div class="form-group">
          <label>اللغة</label>
          <select [(ngModel)]="formData.language">
            <option value="ara">العربية</option>
            <option value="eng">الإنجليزية</option>
          </select>
        </div>

        <div class="form-group">
          <label>المواضيع</label>
          <input 
            type="text" 
            [(ngModel)]="subjectsInput"
            (keyup.enter)="addSubject()"
            placeholder="أدخل الموضوع واضغط Enter"
          >
          <div class="tags">
            <span class="tag" *ngFor="let subject of formData.subjects; let i = index">
              {{ subject }}
              <button class="remove-tag" (click)="removeSubject(i)">×</button>
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>الوصف</label>
          <textarea 
            [(ngModel)]="formData.description"
            rows="4"
            maxlength="2000"
            placeholder="أدخل وصف الكتاب"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              [(ngModel)]="formData.isArabic"
            >
            محتوى عربي
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onix-form {
      padding: 1rem;
      max-height: 30rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .save-btn,
    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background-color 0.2s;
    }

    .save-btn {
      background: #4573d2;
      color: white;
    }

    .save-btn:hover {
      background: #3b63b8;
    }

    .export-btn {
      background: #10b981;
      color: white;
    }

    .export-btn:hover {
      background: #059669;
    }

    .form-content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group:nth-last-child(2) {
      grid-column: span 2;
    }

    .form-group label {
      color: var(--text-color);
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--input-bg);
      color: var(--text-color);
      font-size: 0.95rem;
    }

    .form-group textarea {
      resize: vertical;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-label input {
      width: 16px;
      height: 16px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: var(--input-bg);
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .remove-tag {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      padding: 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-tag:hover {
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .form-content {
        grid-template-columns: 1fr;
      }

      .form-group:nth-last-child(2) {
        grid-column: span 1;
      }
    }
  `]
})
export class OnixFormComponent implements OnInit {
  project: Project | null = null;
  formData: OnixData = {
    title: '',
    author: '',
    publisher: '',
    publicationDate: '',
    isbn: '',
    format: 'BA',
    pages: 0,
    language: 'ara',
    subjects: [],
    description: '',
    isArabic: true
  };

  subjectsInput = '';

  // Font Awesome icons
  faSave = faSave;
  faFileExcel = faFileExcel;

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.fetchProject(Number(params.get('id')));
    });
  }

  fetchProject(selectedProjectId: number): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http
      .get<Project>(`Publisher/${user['publisherId']}/projects/${selectedProjectId}`)
      .subscribe({
        next: (response: Project) => {
          this.project = response;
        },
        error: (error) => {
          console.error('Failed to fetch project', error);
        },
      });
  }

  addSubject() {
    if (this.subjectsInput.trim()) {
      this.formData.subjects.push(this.subjectsInput.trim());
      this.subjectsInput = '';
    }
  }

  removeSubject(index: number) {
    this.formData.subjects.splice(index, 1);
  }

  saveForm() {
    console.log('Saving form data:', this.formData);
    // TODO: Implement save logic
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet([this.formData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ONIX Data');
    XLSX.writeFile(workbook, 'onix-data.xlsx');
  }
}