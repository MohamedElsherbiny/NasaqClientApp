import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUser, faBook, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-profile-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './author-profile-editor.component.html',
  styleUrl: './author-profile-editor.component.scss'
})
export class AuthorProfileEditorComponent implements OnInit {
  profileForm: FormGroup;
  // Font Awesome icons
  faTimes = faTimes;
  faUser = faUser;
  faBook = faBook;
  faCalendar = faCalendar;
  faCheck = faCheck;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(2)]]
    });

  }

  ngOnInit(): void {
    this.loadAuthorData();
    this.http.get('account/getProfile').subscribe({
      next: (response: any) => {
        this.profileForm.patchValue({
          email: response.email
        });
      }
    });
  }

  onClose() {
  }

  private loadAuthorData(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.get<any>(`Author/${user['authorId']}`).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          ...data,
        })
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'خطأ');
      return;
    }

    const formData = {
      ...this.profileForm.value
    };

    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.put(`Author/${user['authorId']}`, formData).subscribe({
      next: () => {
        this.toastr.success('نجاح');
        this.router.navigate(['/author-dashboard']);
      },
      error: (error) => {
        console.error('فشل في إرسال التقييم', error);
        this.toastr.error('فشل في إرسال التقييم، يرجى المحاولة مرة أخرى لاحقًا', 'error');
      }
    });
  }
}
