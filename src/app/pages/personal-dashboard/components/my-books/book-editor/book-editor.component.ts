import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [HttpService],
  templateUrl: './book-editor.component.html',
  styleUrl: './book-editor.component.scss'
})
export class BookEditorComponent {
  bookForm: FormGroup;
  selectedFile: File | null = null;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.bookForm.get('fileName')?.setValue(this.selectedFile.name);
    }
  }

  onSubmit(): void {
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
        },
        error: (error) => {
          console.error('فشل في إرسال الطلب', error);
          this.toastr.error('فشل في إرسال الطلب، يرجى المحاولة مرة أخرى', 'خطأ');
        }
      });
    } else {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة', 'خطأ');
    }
  }
}
