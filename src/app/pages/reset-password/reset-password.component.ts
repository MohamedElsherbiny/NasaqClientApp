import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordCredentials, ResetPasswordFormComponent } from "./reset-password-form/reset-password-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, ResetPasswordFormComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  isLoading = false;
  error: string | null = null;
  userId: string | null = null;
  token: string | null = null;
  resetPassword: string | null = null;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    this.resetPassword = this.route.snapshot.queryParamMap.get('ResetPassword');
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.token = this.route.snapshot.queryParamMap.get('amp;token');
    }
  }

  onSubmit(credentials: ResetPasswordCredentials) {
    if (credentials.password !== credentials.confirmPassword) {
      this.toastr.error('كلمات المرور لا تتطابق', 'خطأ');
      return;
    }

    if (this.userId && this.token) {
      const confirmData = {
        userId: this.userId,
        token: this.token,
        password: credentials.password,
        resetPassword: this.resetPassword ?? false
      };

      this.http.post<any>('account/confirm-email', confirmData).subscribe({
        next: () => {
          this.toastr.success('تم تأكيد البريد الإلكتروني بنجاح!', 'نجاح');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.toastr.error('رمز غير صالح أو منتهي الصلاحية', 'خطأ');
          } else {
            this.toastr.error('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
          }
        }
      });
    } else {
      this.toastr.error('رقم المستخدم أو رمز التأكيد غير موجود.', 'خطأ');
    }
  }
}