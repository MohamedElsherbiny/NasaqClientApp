import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-publisher-employee',
  standalone: true,
  imports: [],
  templateUrl: './update-publisher-employee.component.html',
  styleUrl: './update-publisher-employee.component.scss'
})
export class UpdatePublisherEmployeeComponent {
  @Input() employeeId: number | null = null;
  @Input() employees: PublisherEmployee[] = [];

  @Output() employeeUpdated = new EventEmitter<void>();

  updateEmployeeForm: FormGroup;
  publisherRoleIdsOptions: any[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.updateEmployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      publisherRoleIds: this.fb.array([])
    });
  }

  get publisherRoleIds(): FormArray {
    return this.updateEmployeeForm.get('publisherRoleIds') as FormArray;
  }

  ngOnInit(): void {
    if (this.employeeId !== null) {
      const employee = this.employees.find(
        (employee) => employee.employeeId === this.employeeId
      );
      if (employee) {
        this.updateEmployeeForm.patchValue({
          firstName: employee.name.split(' ')[0],
          lastName: employee.name.split(' ')[1],
          email: employee.email
        });

        this.setRoles(employee.roles.map((role) => role.value));

      }
    }
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

  setRoles(roleIds: number[]): void {
    const roleFormArray = this.updateEmployeeForm.get('publisherRoleIds') as FormArray;
    roleIds.forEach(roleId => {
      roleFormArray.push(this.fb.control(roleId));
    });
  }

  onSubmit(): void {
    if (this.updateEmployeeForm.valid && this.employeeId !== null) {
      const formData = { 
        ...this.updateEmployeeForm.value,
        publisherId: this.user['publisherId'],
        employeeId: this.employeeId 
      };

      this.http.put(`Publisher/${this.user['publisherId']}/employees/${this.employeeId}`, formData).subscribe({
        next: () => {
          this.toastr.success('تم تحديث بيانات الموظف بنجاح', 'نجاح');
          this.employeeUpdated.emit();  // Notify the parent to refresh the employee list
        },
        error: (error) => {
          this.toastr.error('فشل في تحديث بيانات الموظف، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
        }
      });
    } else {
      this.toastr.error('النموذج غير صالح، يرجى تصحيح الأخطاء والمحاولة مرة أخرى', 'خطأ');
    }
  }
}
