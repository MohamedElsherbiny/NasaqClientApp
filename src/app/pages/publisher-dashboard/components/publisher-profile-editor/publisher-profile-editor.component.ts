import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUser, faBook, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publisher-profile-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './publisher-profile-editor.component.html',
  styleUrl: './publisher-profile-editor.component.scss'
})
export class PublisherProfileEditorComponent implements OnInit {
  profileForm: FormGroup;

  // Font Awesome icons
  faTimes = faTimes;
  faUser = faUser;
  faBook = faBook;
  faCalendar = faCalendar;
  faCheck = faCheck;



  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    private toastr: ToastrService) {
    this.profileForm = this.fb.group({
      email: [''],
      publisherType: ['1'],
      firstName: [''],
      lastName: [''],
      cRNumber: [''],
      taxNumber: [''],
      contactEmail: [''],
      address: [''],
      companyName: [''],
    });
  }

  ngOnInit(): void {
    this.http.get('account/getProfile').subscribe({
      next: (response: any) => {
        this.profileForm.patchValue({
          email: response.email
        });
      }
    });
  }

  onClose() {
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = {
        ...this.profileForm.value,
      };

      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      this.http.put(`Publisher/${user['publisherId']}/UpdateProfile`, formData).subscribe({
        next: () => {
          this.toastr.success('نجاح');
          this.router.navigate(['/publisher-dashboard']);
        },
        error: (error) => {
          console.error('فشل في إرسال التقييم', error);
          this.toastr.error('فشل في إرسال التقييم، يرجى المحاولة مرة أخرى لاحقًا', 'error');
        }
      });
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'error');
    }
  }


}
