import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export enum ServiceTypeEnum {
  LiteraryEvaluation = 1,
  PublishingServices = 2,
  TranslationServices = 3,
  LanguageProofreading = 4,
  ContentCreation = 5
}

@Component({
  selector: 'app-service-provider',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [HttpService],
  templateUrl: './service-provider.component.html',
  styleUrl: './service-provider.component.scss'
})

export class ServiceProviderComponent implements OnInit {
  serviceProviderForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  publisherRoleIdsOptions: any[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.serviceProviderForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      publisherRoleIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPublisherEmployeeRoles();
  }
  
  get publisherRoleIds(): FormArray {
    return this.serviceProviderForm.get('publisherRoleIds') as FormArray;
  }

  getPublisherEmployeeRoles() {
    this.http.get<any[]>(`Publisher/GetPublisherEmployeeRoles`).subscribe({
      next: (data) => {
        this.publisherRoleIdsOptions = data;
      }
    });
  }

  onCheckboxChange(event: any) {
    const selected = event.target.value;
    if (event.target.checked) {
      this.publisherRoleIds.push(this.fb.control(selected));
    } else {
      const index = this.publisherRoleIds.controls.findIndex(x => x.value === selected);
      this.publisherRoleIds.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.serviceProviderForm.valid) {
      const formData = {
        publisherId: this.user['publisherId'],
        ...this.serviceProviderForm.value
      };

      this.http.post(`Publisher/AddEmployee/${this.user['publisherId']}`, formData).subscribe({
        next: () => {
          this.toastr.success('تم إرسال الدعوة بنجاح', 'نجاح');
          this.serviceProviderForm.reset();
        },
        error: (error) => {
          console.error('فشل في إرسال الدعوة', error);
          this.toastr.error('فشل في إرسال الدعوة، يرجى المحاولة مرة أخرى لاحقًا', 'فشل');
        }
      });
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'فشل');
    }
  }
}
