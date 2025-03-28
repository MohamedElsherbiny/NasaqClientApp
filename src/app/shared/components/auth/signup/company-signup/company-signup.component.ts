import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
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
      // publisherName: ['', Validators.required],
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.http.post('publisher', this.signupForm.value).subscribe(
        {
          next: () => {
            this.toastr.success('تم إنشاء الحساب بنجاح', 'نجاح');
            this.router.navigate(['/publisher-dashboard']);
          }
        }
      );
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'فشل إنشاء الحساب');
    }
  }
}
