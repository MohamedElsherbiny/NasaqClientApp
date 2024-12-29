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
  selector: 'app-author-contract-editor',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, FormsModule, CommonModule, FontAwesomeModule],
  providers: [HttpService],
  templateUrl: './author-contract-editor.component.html',
  styleUrls: ['./author-contract-editor.component.scss']
})
export class AuthorContractEditorComponent implements OnInit {
  @Input() contract: Contract | null = null;
  @Output() close = new EventEmitter<boolean>();
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  contractForm: FormGroup;
  private baseUrl: string = environment.apiUrl;

  faTimes = faTimes;
  requests: BookRequest[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {
    this.contractForm = this.fb.group({
      requestId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.contract) {
      this.contractForm.patchValue({
        requestId: this.contract?.requestId
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

  onSubmit(): void {
    if (this.contractForm.valid) {
      const formData = {
        contractId: this.contract?.contractId,
        ...this.contractForm.value
      };

      this.http.post(`Publishers/Contracts`, formData).subscribe({
        next: () => {
          this.contractForm.reset();
          this.close.emit(true);
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}