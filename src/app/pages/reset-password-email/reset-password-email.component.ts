import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordEmailCredentials, ResetPasswordEmailFormComponent } from "./reset-password-email-form/reset-password-email-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password-email',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, ResetPasswordEmailFormComponent],
  templateUrl: './reset-password-email.component.html',
  styleUrl: './reset-password-email.component.scss'
})
export class ResetPasswordEmailComponent {
  isLoading = false;
  error: string | null = null;
  userId: string | null = null;
  token: string | null = null;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.token = this.route.snapshot.queryParamMap.get('amp;token');
    }
  }

  onSubmit(credentials: ResetPasswordEmailCredentials) {

    const confirmData = {
      email: credentials.email
    };

    this.http.post<any>('account/reset-password-request', confirmData).subscribe({
      next: () => {
        this.toastr.success('تم إرسال رابط تغيير كلمة المرور على البريد الإلكتروني بنجاح!', 'نجاح');
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
  }
}