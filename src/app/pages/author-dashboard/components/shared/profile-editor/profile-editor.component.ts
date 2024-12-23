import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Book } from '../../../../../shared/models/Book';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService, DatePipe],
  templateUrl: './profile-editor.component.html',
  styleUrl: './profile-editor.component.scss'
})
export class ProfileEditorComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  profileForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  faTimes = faTimes;

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
          this.onClose();
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

  onClose() {
    this.close.emit();
  }
}
