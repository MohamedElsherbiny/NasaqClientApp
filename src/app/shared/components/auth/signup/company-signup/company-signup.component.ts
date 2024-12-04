import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [HttpService],
  templateUrl: './company-signup.component.html',
  styleUrl: './company-signup.component.scss'
})
export class CompanySignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      publisherName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    debugger
    if (this.signupForm.valid) {
      this.http.post('publisher', this.signupForm.value).subscribe(
        {
          next: () => {
            this.toastr.success('تم إنشاء الحساب بنجاح', 'نجاح');
            this.router.navigate(['/corporate-dashboard']);
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
