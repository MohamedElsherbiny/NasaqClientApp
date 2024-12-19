import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export type LoginResponse = {
  token: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export function getFormValue<T>(form: FormGroup): T {
  return form.value as T;
}
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, RouterLink],
  providers: [HttpService],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  @Output() formSubmit = new EventEmitter<LoginCredentials>();

  @Input() isLoading = false;
  @Input() error: string | null = null;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.formSubmit.emit(getFormValue<LoginCredentials>(this.loginForm));
    }
  }

  // Font Awesome icons
  readonly icons = {
    envelope: faEnvelope,
    lock: faLock,
    spinner: faSpinner
  };

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control?.errors) return '';

    const messages = LOGIN_VALIDATION_MESSAGES[field as keyof typeof LOGIN_VALIDATION_MESSAGES];
    const firstError = Object.keys(control.errors)[0];

    if (typeof messages === 'object') {
      if (firstError === 'minlength' && 'minlength' in messages) {
        return messages.minlength(control.errors[firstError].requiredLength);
      }
      return messages[firstError as keyof typeof messages] || '';
    }

    return '';
  }
}

export const LOGIN_VALIDATION_MESSAGES = {
  email: {
    required: 'البريد الإلكتروني مطلوب',
    email: 'يرجى إدخال بريد إلكتروني صحيح'
  },
  password: {
    required: 'كلمة المرور مطلوبة',
    minlength: (length: number) => `كلمة المرور يجب أن تكون ${length} أحرف على الأقل`
  }
} as const;