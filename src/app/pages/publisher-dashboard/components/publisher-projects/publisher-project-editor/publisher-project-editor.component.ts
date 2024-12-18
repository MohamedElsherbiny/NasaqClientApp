import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Project } from '../../shared/models/project.model';

@Component({
  selector: 'app-publisher-project-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './publisher-project-editor.component.html',
  styleUrl: './publisher-project-editor.component.scss'
})
export class PublisherProjectEditorComponent implements OnInit {
  @Input() publisherProject: Project | null = null;
  @Output() close = new EventEmitter<boolean>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  publisherProjectForm: FormGroup;
  serviceTypeOptions: any[] = [];

  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.publisherProjectForm = this.fb.group({
      authorBookTitle: ['', Validators.required],
      authorFirstName: ['', Validators.required],
      authorLastName: ['', Validators.required],
      authorEmail: ['', [Validators.required, Validators.email]],
      projectServiceIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPublisherServiceTypes();
  }

  get projectServiceIds(): FormArray {
    return this.publisherProjectForm.get('projectServiceIds') as FormArray;
  }

  private getPublisherServiceTypes() {
    this.http.get<any[]>(`Publisher/GetPublisherServiceTypes`).subscribe({
      next: (data) => {
        this.serviceTypeOptions = data;
      }
    });
  }

  onCheckboxChange(event: any) {
    const selected = +event.target.value; // Convert to a number for comparison
    const isChecked = event.target.checked;

    if (isChecked) {
      this.projectServiceIds.push(this.fb.control(selected));
    } else {
      const index = this.projectServiceIds.controls.findIndex((x) => x.value === selected);
      this.projectServiceIds.removeAt(index);
    }

    // Update the disabled state based on the current selection
    this.updateServiceTypeOptionsState();
  }

  private updateServiceTypeOptionsState() {
    const selectedIds = this.projectServiceIds.value;

    this.serviceTypeOptions = this.serviceTypeOptions.map((option) => {
      const isServiceTypeOne = option.value === 1;
      const isOtherServiceSelected = selectedIds.some((id: number) => id !== 1);
      const isServiceTypeOneSelected = selectedIds.includes(1);

      return {
        ...option,
        disabled:
          (isServiceTypeOne && isOtherServiceSelected) ||
          (!isServiceTypeOne && isServiceTypeOneSelected),
      };
    });
  }

  isOptionChecked(value: number): boolean {
    return this.projectServiceIds.value.includes(value);
  }

  onSubmit(): void {
    if (this.publisherProjectForm.valid) {
      const formData = {
        publisherId: this.user['publisherId'],
        ...this.publisherProjectForm.value
      };

      if (this.projectServiceIds.length === 0) {
        this.toastr.error('يجب اختيار على الأقل دور واحد', 'خطأ في النموذج');
        return;
      }

      this.http.post(`Projects/${this.user['publisherId']}`, formData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة المشروع بنجاح', 'نجاح');
          this.publisherProjectForm.reset();
          this.close.emit(true);
        },
        error: (error) => {
          console.error('فشل في إضافة المشروع', error);
          this.toastr.error('فشل في إضافة المشروع، يرجى المحاولة مرة أخرى لاحقًا', 'فشل');
        }
      });
    } else {
      console.warn('فشل إرسال النموذج: النموذج غير صالح');
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'خطأ في النموذج');
    }
  }

  onClose() {
    this.close.emit();
  }
}
