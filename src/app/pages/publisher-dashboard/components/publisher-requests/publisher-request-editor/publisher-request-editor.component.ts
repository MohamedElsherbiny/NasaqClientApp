import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookRequest } from '../../../../../shared/models/BookRequest';
import { PublisherEmployee } from '../../../../../shared/models/PublisherEmployee';

@Component({
  selector: 'app-publisher-request-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, FormsModule, CommonModule, FontAwesomeModule],
  providers: [HttpService],
  templateUrl: './publisher-request-editor.component.html',
  styleUrls: ['./publisher-request-editor.component.scss']
})
export class PublisherRequestEditorComponent implements OnInit {
  @Input() request: BookRequest | null = null;
  @Output() close = new EventEmitter<boolean>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  requestForm: FormGroup;

  faTimes = faTimes;
  employees: PublisherEmployee[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.requestForm = this.fb.group({
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.request) {
      this.requestForm.patchValue({
        employeeId: this.request?.evaluator?.employeeId
      });
    }
    this.getEmployees();
  }

  getEmployees(): void {
    this.http.get<PublisherEmployee[]>(`Publisher/${this.user['publisherId']}/employees`).subscribe({
      next: (data) => {
        this.employees = data.filter(employee => !employee.isAdmin);
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const formData = {
        requestId: this.request?.requestId,
        ...this.requestForm.value
      };

      this.http.post(`Requests/${this.user['publisherId']}/assign-evaluator`, formData).subscribe({
        next: () => {
          this.requestForm.reset();
          this.close.emit(true);
        },
        error: (error) => {
        }
      });
    } else {
    }
  }

  onClose() {
    this.close.emit();
  }
}