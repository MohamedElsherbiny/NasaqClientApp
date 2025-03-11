import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Project } from '../../shared/models/project.model';
import { Book } from '../../../../../shared/models/Book';

@Component({
  selector: 'app-author-project-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './author-project-editor.component.html',
  styleUrl: './author-project-editor.component.scss'
})
export class AuthorProjectEditorComponent implements OnInit {
  @Input() authorProject: Project | null = null;
  @Output() close = new EventEmitter<boolean>();

  books: Book[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  authorProjectForm: FormGroup;
  serviceTypeOptions: any[] = [];

  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.authorProjectForm = this.fb.group({
      bookId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`).subscribe({
      next: (response: any) => {
        this.books = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }

  onSubmit(): void {
    if (this.authorProjectForm.valid) {
      const formData = {
        authorId: this.user['authorId'],
        ...this.authorProjectForm.value
      };

      this.http.post(`Projects/CreateAuthorProject`, formData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة المشروع بنجاح', 'نجاح');
          this.authorProjectForm.reset();
          this.close.emit(true);
        }
      });
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'خطأ في النموذج');
    }
  }

  onClose() {
    this.close.emit();
  }
}
