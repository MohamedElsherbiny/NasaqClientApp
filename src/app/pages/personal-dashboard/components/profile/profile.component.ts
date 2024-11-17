import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [HttpService, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      biography: [''],
      dateOfBirth: [null],
      email: ['', [Validators.required, Validators.email]],
      bankName: [''],
      accountHolderName: [''],
      iban: [''],
      swiftCode: ['']
    });

  }
  ngOnInit(): void {
    this.loadAuthorData();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.http.put(`Author/${this.user['authorId']}`, this.profileForm.value).subscribe({
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


  private loadAuthorData(): void {
    this.http.get<any>(`Author/${this.user['authorId']}`).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          ...data,
          dateOfBirth: this.datePipe.transform(data.dateOfBirth, 'yyyy-MM-dd')
        });
      },
      error: () => this.toastr.error('فشل في تحميل البيانات', 'خطأ')
    });
  }
}
