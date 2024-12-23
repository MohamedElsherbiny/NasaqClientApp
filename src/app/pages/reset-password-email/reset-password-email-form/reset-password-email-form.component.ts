import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/core/services/http.service';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

export type ResetPasswordEmailResponse = {
  token: string;
}
export interface ResetPasswordEmailCredentials {
  email: string;
}
export function getFormValue<T>(form: FormGroup): T {
  return form.value as T;
}
@Component({
  selector: 'app-reset-password-email-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, RouterLink],
  providers: [HttpService],
  templateUrl: './reset-password-email-form.component.html',
  styleUrl: './reset-password-email-form.component.scss'
})
export class ResetPasswordEmailFormComponent {
  @Output() formSubmit = new EventEmitter<ResetPasswordEmailCredentials>();

  @Input() isLoading = false;
  @Input() error: string | null = null;

  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.formSubmit.emit(getFormValue<ResetPasswordEmailCredentials>(this.resetPasswordForm));
    }
  }

  // Font Awesome icons
  readonly icons = {
    envelope: faEnvelope,
    lock: faLock,
    spinner: faSpinner
  };

  isFieldInvalid(field: string): boolean {
    const control = this.resetPasswordForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.resetPasswordForm.get(field);
    if (!control?.errors) return '';

    const messages = LOGIN_VALIDATION_MESSAGES[field as keyof typeof LOGIN_VALIDATION_MESSAGES];
    const firstError = Object.keys(control.errors)[0];

    if (typeof messages === 'object') {
      return messages[firstError as keyof typeof messages] || '';
    }

    return '';
  }
}

export const LOGIN_VALIDATION_MESSAGES = {
  confirmPassword: {
    required: 'تاكيد كلمة المرور مطلوبة',
  },
  password: {
    required: 'كلمة المرور مطلوبة'
  }
} as const;