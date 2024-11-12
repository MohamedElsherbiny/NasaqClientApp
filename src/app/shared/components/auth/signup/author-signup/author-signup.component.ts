import { Component } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [HttpService],
  templateUrl: './author-signup.component.html',
  styleUrl: './author-signup.component.scss'
})
export class AuthorSignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.http.post('account/RegisterAuthor', this.signupForm.value).subscribe(
        {
          next: () => {
            this.toastr.success('تم إنشاء الحساب بنجاح', 'نجاح');
            this.router.navigate(['/personal-dashboard']);
          },
          error: (error) => {
            console.error('فشل في إنشاء الحساب', error);
            this.toastr.error('فشل في إنشاء الحساب، يرجى المحاولة مرة أخرى لاحقًا', 'فشل إنشاء الحساب');
          }
        }
      );
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'فشل إنشاء الحساب');
    }
  }
}
