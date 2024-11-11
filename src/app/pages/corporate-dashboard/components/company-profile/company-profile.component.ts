import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [HttpService],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  serviceTypeOptions: any[] = [];
  selectedServiceTypes: Set<any> = new Set();

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
      description: ['', Validators.required],
      serviceTypes: this.fb.array([])
    });
  }

  get serviceTypes(): FormArray {
    return this.profileForm.get('serviceTypes') as FormArray;
  }

  getServiceTypeFormGroup(value: any): FormGroup {
    return this.serviceTypes.controls.find(
      (control) => control.get('serviceTypeId')?.value === value
    ) as FormGroup;
  }
  ngOnInit(): void {
    this.getPublisherServiceTypes();
    this.loadPublisherData();
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

  onCheckboxChange(event: any, option: any): void {
    if (event.target.checked) {
      this.selectedServiceTypes.add(option.value);
      const serviceGroup = this.fb.group({
        serviceTypeId: [option.value, Validators.required],
        price: [null, Validators.required],
        description: ['', Validators.required]
      });
      this.serviceTypes.push(serviceGroup);
    } else {
      this.selectedServiceTypes.delete(option.value);
      const index = this.serviceTypes.controls.findIndex(
        (control) => control.get('serviceTypeId')?.value === option.value
      );
      if (index !== -1) {
        this.serviceTypes.removeAt(index);
      }
    }
  }

  isChecked(value: any): boolean {
    return this.selectedServiceTypes.has(value);
  }

  isServiceTypeSelected(value: any): boolean {
    return this.selectedServiceTypes.has(value);
  }

  private loadPublisherData(): void {
    this.http.get<any>(`Publisher/${this.user['publisherId']}`).subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);

        this.setSelectedServiceTypes(data);
      },
      error: () => this.toastr.error('فشل في تحميل البيانات', 'خطأ')
    });
  }

  private setSelectedServiceTypes(data: any) {
    if (data.serviceTypes && data.serviceTypes.length > 0) {
      this.selectedServiceTypes.clear();
      this.serviceTypes.clear();

      data.serviceTypes.forEach((service: { serviceTypeId: number; price: number; description: string; }) => {
        this.selectedServiceTypes.add(service.serviceTypeId);

        const serviceGroup = this.fb.group({
          serviceTypeId: [service.serviceTypeId, Validators.required],
          price: [service.price, Validators.required],
          description: [service.description, Validators.required]
        });

        this.serviceTypes.push(serviceGroup);
      });
    }
  }

  private getPublisherServiceTypes() {
    this.http.get<any[]>(`Publisher/GetPublisherServiceTypes`).subscribe({
      next: (data) => {
        this.serviceTypeOptions = data;
      }
    });
  }
}
