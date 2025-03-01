import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from './shared/core/services/role.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpService,
    private roleService: RoleService,
    private toastr: ToastrService) { }
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.http.get('account/getProfile').subscribe({
      next: (response) => {
        console.log(this.roleService.getUserRoles());
        console.log(response);
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
}

