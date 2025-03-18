import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faUser, faBook, faCalendar, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Router } from '@angular/router';
import { PublisherServicesFormComponent } from "../shared/publisher-services-editor/publisher-services-form.component";

@Component({
  selector: 'app-publisher-profile-editor',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, PublisherServicesFormComponent],
  templateUrl: './publisher-profile-editor.component.html',
  styleUrl: './publisher-profile-editor.component.scss'
})
export class PublisherProfileEditorComponent implements OnInit {
  profileForm: FormGroup;
  services: any[] = [];
  publisherTypes = [
    { value: '1', label: 'مؤسسة' },
    { value: '2', label: 'فرد' }
  ]
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
      email: ['', [Validators.required, Validators.email]],
      publisherType: ['1', [Validators.required]],
      companyName: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cRNumber: ['', []], // No validators initially
      taxNumber: ['', []], // No validators initially
      contactEmail: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.profileForm.get('publisherType')?.valueChanges.subscribe(value => {
      const companyNameControl = this.profileForm.get('companyName');
      if (value === '1') {
        companyNameControl?.setValidators([Validators.required]);
      } else {
        companyNameControl?.clearValidators();
      }
      companyNameControl?.updateValueAndValidity();

      const cRNumberControl = this.profileForm.get('cRNumber');
      const taxNumberControl = this.profileForm.get('taxNumber');

      if (value === '1') {
        // Add required and pattern validators for مؤسسة
        cRNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
        taxNumberControl?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      } else {
        // Clear validators for فرد
        cRNumberControl?.clearValidators();
        taxNumberControl?.clearValidators();
      }

      // Update the control's validity
      cRNumberControl?.updateValueAndValidity();
      taxNumberControl?.updateValueAndValidity();
    });


  }

  ngOnInit(): void {
    this.getPublisherServiceTypes();
    this.loadPublisherData();
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

  areServicesValid(): boolean {
    return this.services
      .filter(service => service.isSelected)
      .every(service => service.price && service.description);
  }

  private getPublisherServiceTypes() {
    this.http.get<any[]>(`Publisher/GetPublisherServiceTypes`).subscribe({
      next: (data) => {
        this.services = data;
      }
    });
  }

  private loadPublisherData(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.get<any>(`Publisher/${user['publisherId']}`).subscribe({
      next: (data) => {
        this.setSelectedServiceTypes(data);
        // this.publisher = data;
      }
    });
  }

  private setSelectedServiceTypes(data: any) {
    if (data.serviceTypes && data.serviceTypes.length > 0) {
      data.serviceTypes.forEach((service: { serviceTypeId: number; price: number; description: string; }) => {
        let publisherService = this.services.find(s => s.value === service.serviceTypeId);
        if (publisherService) {
          publisherService.isSelected = true;
          publisherService.price = service.price;
          publisherService.description = service.description;
        }
      });
    }
  }

  onServicesChange(services: any[]) {
    this.services = services;
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.areServicesValid()) {
      this.profileForm.markAllAsTouched();
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'خطأ');
      return;
    }

    const selectedServices = this.services.filter(s => s.isSelected);
    if (selectedServices.length === 0) {
      this.toastr.error('يجب اختيار خدمة واحدة على الأقل', 'خطأ');
      return;
    }

    const formData = {
      ...this.profileForm.value,
      serviceTypes: selectedServices.map(s => ({
        serviceTypeId: s.value,
        price: s.price,
        description: s.description
      }))
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
  }
}
