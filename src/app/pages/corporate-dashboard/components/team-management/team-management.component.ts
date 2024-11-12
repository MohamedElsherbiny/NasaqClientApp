import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteServiceProviderComponent } from "./delete-service-provider/delete-service-provider.component";
import { PublisherEmployee } from '../../../../shared/models/PublisherEmployee';
import { UpdatePublisherEmployeeComponent } from "./update-publisher-employee/update-publisher-employee.component";


@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, DeleteServiceProviderComponent, UpdatePublisherEmployeeComponent],
  providers: [HttpService],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.scss'
})
export class TeamManagementComponent implements OnInit {
  employees: PublisherEmployee[] = [];
  checkedAll: boolean = false;
  checkedEmployees: boolean[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedEmployeeId: number | null = null;

  constructor(
    private http: HttpService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.http.get<PublisherEmployee[]>(`Publisher/${this.user['publisherId']}/employees`).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        this.toastr.error('فشل في تحميل قائمة الموظفين، يرجى المحاولة مرة أخرى لاحقًا', 'خطأ');
      }
    });
  }

  checkAll(event: Event): void {
    this.checkedAll = (event.target as HTMLInputElement).checked;
    this.checkedEmployees.fill(this.checkedAll);
  }

  checkRow(index: number, event: Event): void {
    this.checkedEmployees[index] = (event.target as HTMLInputElement).checked;
    this.checkedAll = this.checkedEmployees.every(checked => checked);
  }
}
