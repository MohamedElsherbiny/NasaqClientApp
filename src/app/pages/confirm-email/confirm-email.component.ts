import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { HttpService } from '../../shared/core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [FooterComponent, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
  password: string = '';
  confirmPassword: string = '';
  userId: string | null = null;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.token = this.route.snapshot.queryParamMap.get('amp;token');
  }


  onSubmit() {
    debugger;
    if (this.password !== this.confirmPassword) {
      this.toastr.error('كلمات المرور لا تتطابق', 'خطأ');
      return;
    }

    if (this.userId && this.token) {
      const confirmData = {
        userId: this.userId,
        token: this.token,
        password: this.password
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

