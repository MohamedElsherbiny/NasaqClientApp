// import { CommonModule, DatePipe } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { HttpService } from '../../../../../shared/core/services/http.service';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-publisher-profile-editor',
//   standalone: true,
//   imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
//   providers: [HttpService, DatePipe],
//   templateUrl: './publisher-profile-editor.component.html',
//   styleUrl: './publisher-profile-editor.component.scss'
// })
// export class PublisherProfileEditorComponent implements OnInit {
//   @Output() close = new EventEmitter<boolean>();
//   profileForm: FormGroup;
//   publisher: any = {};
//   user = JSON.parse(localStorage.getItem('user') ?? '{}');
//   faTimes = faTimes;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpService,
//     private toastr: ToastrService
//   ) {
//     this.profileForm = this.fb.group({
//       companyName: ['', Validators.required],
//       phoneNumber: ['', Validators.required],
//       contactEmail: ['', [Validators.required, Validators.email]],
//       location: ['', Validators.required],
//       logoUrl: [''],
//       description: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     this.loadPublisherData();
//   }

//   onSubmit(): void {
//     if (this.profileForm.valid) {
//       const payload = {
//         ...this.publisher,
//         ...this.profileForm.value
//       };

//       this.http.put(`Publisher/${this.user['publisherId']}`, payload).subscribe({
//         next: () => {
//           this.toastr.success('تم حفظ التغييرات بنجاح', 'نجاح');
//         },
//         error: (error) => {
//           console.error('فشل في حفظ التغييرات', error);
//           this.toastr.error('فشل في حفظ التغييرات، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
//         }
//       });
//     } else {
//       this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'خطأ');
//     }
//   }

//   private loadPublisherData(): void {
//     this.http.get<any>(`Publisher/${this.user['publisherId']}`).subscribe({
//       next: (data) => {
//         this.profileForm.patchValue(data);
//         this.publisher = data;
//       },
//       error: () => this.toastr.error('فشل في تحميل البيانات', 'خطأ')
//     });
//   }

//   onClose() {
//     this.close.emit();
//   }
// }
