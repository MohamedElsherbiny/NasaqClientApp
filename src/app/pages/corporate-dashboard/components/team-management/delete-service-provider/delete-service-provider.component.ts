import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-service-provider',
  standalone: true,
  imports: [],
  templateUrl: './delete-service-provider.component.html',
  styleUrl: './delete-service-provider.component.scss'
})
export class DeleteServiceProviderComponent {
  @Input() employeeId: number | null = null;
  @Input() employees: PublisherEmployee[] = [];

  @Output() employeeDeleted = new EventEmitter<void>(); // Event emitter

  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(
    private http: HttpService,
    private toastr: ToastrService
  ) { }

  deleteEmployee(): void {
    if (this.employeeId !== null) {
      this.http.delete(`Publisher/${this.user['publisherId']}/employees/${this.employeeId}`).subscribe({
        next: () => {
          this.toastr.success('تم حذف الموظف بنجاح', 'نجاح');
          this.employees = this.employees.filter(employee => employee.employeeId !== this.employeeId);
          this.employeeId = null;
          
          this.employeeDeleted.emit();
        },
        error: (error) => {
          this.toastr.error('فشل في حذف الموظف، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
          this.employeeId = null;
        }
      });
    }
  }
}
