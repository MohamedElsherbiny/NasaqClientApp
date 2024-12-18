import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials, LoginFormComponent, LoginResponse } from "./login-form/login-form.component";
import { Router } from '@angular/router';
import { HttpService } from '../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  error: string | null = null;
  private roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  constructor(
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) { }



  onSubmit(credentials: LoginCredentials) {
    try {
      this.isLoading = true;
      this.error = null;
      this.http.post<LoginResponse>('account/login', { email: credentials.email, password: credentials.password }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          const jwtHelper = new JwtHelperService();
          localStorage.setItem('user', JSON.stringify(jwtHelper.decodeToken(response.token)));
          this.redirectToDashboard();
        },
        error: (error) => {
          if (error.status === 401) {
            this.toastr.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'فشل تسجيل الدخول');
          } else {
            this.toastr.error('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى لاحقًا', 'فشل تسجيل الدخول');
          }
        }
      });
    } catch (error) {
      this.error = 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.';
    } finally {
      this.isLoading = false;
    }
  }


  redirectToDashboard(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    if ((user[this.roleKey] as string)?.includes('Author')) {
      this.router.navigate(['/author-dashboard/books']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('PublisherEmployee')) {
      this.router.navigate(['/publisher-dashboard/tasks']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('Publisher')) {
      this.router.navigate(['/publisher-dashboard/team']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('Admin')) {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.router.navigate(['/']);
  }
}