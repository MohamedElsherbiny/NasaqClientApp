import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [HttpService],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      logoUrl: [''],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPublisherData();
  }

  loadPublisherData(): void {
    this.http.get<any>(`Publisher/${this.user['publisherId']}`).subscribe({
      next: (data) => this.profileForm.patchValue(data),
      error: () => this.toastr.error('فشل في تحميل البيانات', 'خطأ')
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.http.put(`Publisher/${this.user['publisherId']}`, this.profileForm.value).subscribe({
        next: () => {
          this.toastr.success('تم حفظ التغييرات بنجاح', 'نجاح');
        },
        error: (error) => {
          console.error('فشل في حفظ التغييرات', error);
          this.toastr.error('فشل في حفظ التغييرات، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
        }
      });
    } else {
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'خطأ');
    }
  }
}
