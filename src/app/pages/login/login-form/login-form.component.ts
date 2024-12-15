import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

type LoginResponse = {
  token: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  providers: [HttpService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) { }


  onSubmit() {
    this.http.post<LoginResponse>('account/login', { email: this.email, password: this.password }).subscribe({
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
  }
  redirectToDashboard(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    if ((user[this.roleKey] as string)?.includes('Author')) {
      this.router.navigate(['/author-dashboard']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('PublisherEmployee')) {
      this.router.navigate(['/publisher-dashboard/tasks']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('Publisher')) {
      this.router.navigate(['/publisher-dashboard']);
      return;
    } else if ((user[this.roleKey] as string)?.includes('Admin')) {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.router.navigate(['/']);
  }
}
