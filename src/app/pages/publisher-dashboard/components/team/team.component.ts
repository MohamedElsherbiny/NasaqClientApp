import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../../shared/core/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { PublisherEmployee } from '../../../../shared/models/PublisherEmployee';
import {
  faPlus,
  faEllipsisVertical,
  faPen,
  faTrash,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TeamMemberEditorComponent } from "./team-member-editor/team-member-editor.component";

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FontAwesomeModule,
    TeamMemberEditorComponent
  ],
  providers: [HttpService],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  employees: PublisherEmployee[] = [];
  checkedAll: boolean = false;
  checkedEmployees: boolean[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  selectedEmployeeId: number | null = null;
  selectedPublisherEmployee: PublisherEmployee | null = null;
  showForm = false;

  // Font Awesome icons
  faPlus = faPlus;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faTable = faTable;

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
        this.employees = data.filter(employee => !employee.isAdmin);
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

  // Mapping of role values to background color classes
  roleColorMap: any = {
    1: 'bg-primary',  // Value 1 gets the blue color
    2: 'bg-success',  // Value 2 gets the green color
    3: 'bg-danger',   // Value 3 gets the red color
    4: 'bg-warning',  // Value 4 gets the yellow color
    5: 'bg-info',     // Value 5 gets the light blue color
    // Add more mappings as needed
  };

  // Method to get the role's background color based on its value
  getRoleStyle(role: any): string {
    // Return the corresponding background color class
    const color = this.roleColorMap[role.value] || 'bg-secondary'; // Default to 'bg-secondary' if no match
    return color;
  }


  toggleMenu(event: Event, bookId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === bookId ? null : bookId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }

  onAddPublisherEmployee(): void {
    this.selectedPublisherEmployee = null;
    this.showForm = true;
  }

  editPublisherEmployee(project: PublisherEmployee): void {
    this.selectedPublisherEmployee = project;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(event: boolean): void {
    if (event) {
      this.getEmployees();
    }

    this.showForm = false;
    this.selectedPublisherEmployee = null;
  }
}
