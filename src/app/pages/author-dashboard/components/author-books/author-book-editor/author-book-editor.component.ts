import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Book } from '../../../../../shared/models/Book';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-book-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './author-book-editor.component.html',
  styleUrl: './author-book-editor.component.scss'
})
export class AuthorBookEditorComponent {
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();
  bookForm: FormGroup;
  selectedFile: File | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  fileError: boolean = false;

  faTimes = faTimes;
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      isbn: ['', Validators.required],
      publicationDate: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Check file type (only .doc and .docx allowed)
      if (file.type !== 'application/msword' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.fileError = true;
        this.selectedFile = null;
        this.toastr.error('يرجى اختيار ملف بصيغة .doc أو .docx فقط', 'خطأ');
      } else {
        this.selectedFile = file;
        this.fileError = false;
        this.bookForm.get('fileName')?.setValue(this.selectedFile.name);
      }
    }
  }

  onSubmit(): void {
    this.close.emit();
    if (this.bookForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.bookForm.get('title')?.value);
      formData.append('description', this.bookForm.get('description')?.value);
      formData.append('isbn', this.bookForm.get('isbn')?.value);
      formData.append('publicationDate', this.bookForm.get('publicationDate')?.value);
      formData.append('authorId', this.user['authorId']);
      formData.append('formFile', this.selectedFile, this.selectedFile.name);
      formData.append('fileName', this.selectedFile.name);

      this.http.post(`Author/${this.user['authorId']}/book`, formData).subscribe({
        next: () => {
          this.toastr.success('تم إرسال الطلب بنجاح', 'نجاح');
          this.bookForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/personal-dashboard/my-books']);
          this.close.emit();
        },
        error: (error) => {
          console.error('فشل في إرسال الطلب', error);
          this.toastr.error('فشل في إرسال الطلب، يرجى المحاولة مرة أخرى', 'خطأ');
          this.close.emit();
        }
      });
    } else {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة', 'خطأ');
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.bookForm.get('fileName')?.reset();
    this.fileError = false;
  }

  onClose() {
    this.close.emit();
  }
}
