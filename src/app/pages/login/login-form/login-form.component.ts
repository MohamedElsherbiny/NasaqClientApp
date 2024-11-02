import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  email: string = '';
  password: string = '';

  constructor(private http: HttpService, private router: Router) { }

  onSubmit() {
    this.http.post<LoginResponse>('account/login', { email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        const jwtHelper = new JwtHelperService();
        localStorage.setItem('user', JSON.stringify(jwtHelper.decodeToken(response.token)));

        this.router.navigate(['/personal-dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
