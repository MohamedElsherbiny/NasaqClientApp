import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';

@Component({
  selector: 'app-team-member-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FontAwesomeModule, FormsModule],
  providers: [HttpService],
  templateUrl: './team-member-editor.component.html',
  styleUrl: './team-member-editor.component.scss'
})
export class TeamMemberEditorComponent {
  @Input() teamMember: PublisherEmployee | null = null;
  @Output() close = new EventEmitter<void>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  teamMemberForm: FormGroup;
  publisherRoleIdsOptions: any[] = [];

  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.teamMemberForm = this.fb.group({
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
    return this.teamMemberForm.get('publisherRoleIds') as FormArray;
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
    if (this.teamMemberForm.valid) {
      const formData = {
        publisherId: this.user['publisherId'],
        ...this.teamMemberForm.value
      };

      if (this.publisherRoleIds.length === 0) {
        this.toastr.error('يجب اختيار على الأقل تخصص واحد', 'فشل');
        return;
      }

      this.http.post(`Publisher/AddEmployee/${this.user['publisherId']}`, formData).subscribe({
        next: () => {
          this.toastr.success('تم إرسال الدعوة بنجاح', 'نجاح');
          this.teamMemberForm.reset();
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

  onClose() {
    this.close.emit();
  }
}
