import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Contract } from '../../../../../shared/models/Contract';
import { BookRequest } from '../../../../../shared/models/BookRequest';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-publisher-contract-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, FormsModule, CommonModule, FontAwesomeModule],
  providers: [HttpService],
  templateUrl: './publisher-contract-editor.component.html',
  styleUrls: ['./publisher-contract-editor.component.scss']
})
export class PublisherContractEditorComponent implements OnInit {
  @Input() contract: Contract | null = null;
  @Output() close = new EventEmitter<boolean>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  contractForm: FormGroup;

  faTimes = faTimes;
  requests: BookRequest[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.contractForm = this.fb.group({
      requestId: ['', Validators.required],
      totalPrice: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.contract) {
      this.contractForm.patchValue({
        requestId: this.contract?.requestId,
        totalPrice: this.contract?.totalPrice
      });
    }
    this.fetchRequests();
  }

  fetchRequests(): void {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.http.get(`Publisher/${user['publisherId']}/requests`).subscribe({
      next: (response: any) => {
        this.requests = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch requests', error);
      }
    });
  }

  showPrice(): boolean {
    return this.requests.find(request => request.requestId == this.contractForm.get('requestId')?.value)?.isPublishService || false;
  }

  onSubmit(): void {
    if (this.contractForm.valid) {
      const formData = {
        contractId: this.contract?.contractId,
        ...this.contractForm.value
      };

      if (this.contract) {
        this.http.put(`Publishers/Contracts`, formData).subscribe({
          next: () => {
            this.toastr.success('تم تعديل العقد بنجاح', 'نجاح');
            this.contractForm.reset();
            this.close.emit(true);
          }
        });
      } else {
        this.http.post(`Publishers/Contracts`, formData).subscribe({
          next: () => {
            this.toastr.success('تم إنشاء العقد بنجاح', 'نجاح');
            this.contractForm.reset();
            this.close.emit(true);
          }
        });
      }
    }
  }

  onClose() {
    this.close.emit();
  }
}