import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../shared/core/services/http.service';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export type ResetPasswordResponse = {
  token: string;
}
export interface ResetPasswordCredentials {
  password: string;
  confirmPassword: string;
}
export function getFormValue<T>(form: FormGroup): T {
  return form.value as T;
}
@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
  providers: [HttpService],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.scss'
})
export class ResetPasswordFormComponent {
  @Output() formSubmit = new EventEmitter<ResetPasswordCredentials>();

  @Input() isLoading = false;
  @Input() error: string | null = null;

  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      confirmPassword: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.formSubmit.emit(getFormValue<ResetPasswordCredentials>(this.resetPasswordForm));
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