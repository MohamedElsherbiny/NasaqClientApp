import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { ContractStatus } from '../../../../shared/models/ContractStatus';
import { faEllipsisVertical, faFileContract, faUpload, faDownload, faSignature, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Contract } from '../../../../shared/models/Contract';
import { ContractDocumentsComponent } from "../../../../shared/components/contract-documents/contract-documents.component";
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-author-contracts',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ContractDocumentsComponent],
  templateUrl: './author-contracts.component.html',
  styleUrl: './author-contracts.component.scss'
})
export class AuthorContractsComponent implements OnInit {
  contracts: Contract[] = [];
  ContractStatus = ContractStatus;
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  selectedContract: Contract | null = null;
  activeMenu: number | null = null;
  showForm = false;
  showDocuments = false;

  // Font Awesome icons
  faEllipsisVertical = faEllipsisVertical;
  faUpload = faUpload;
  faDownload = faDownload;
  faFileContract = faFileContract;
  faSignature = faSignature;
  faEye = faEye;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchContracts();
  }

  fetchContracts(): void {
    this.http.get(`Authors/Contracts`).subscribe({
      next: (response: any) => {
        this.contracts = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch contracts', error);
      }
    });
  }

  onFileSelected(event: any, contractId: number): void {
    const file: File = event.target.files[0];
    this.uploadFile(file, contractId);

    // if (file && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    //   this.uploadFile(file, contractId);
    // } else {
    //   alert('Please select a valid Word document (.doc or .docx)');
    // }
  }

  uploadFile(file: File, contractId: number): void {
    const formData = new FormData();
    formData.append('formFile', file);
    formData.append('contractId', contractId.toString());

    this.http.post(`Publishers/Contracts/UploadContractFile`, formData).subscribe({
      next: (response) => {
        console.log('File uploaded successfully', response);
        this.fetchContracts();
      },
      error: (error) => {
        console.error('Failed to upload file', error);
      },
    });
  }

  toggleMenu(event: Event, bookId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === bookId ? null : bookId;
  }

  editContract(contract: Contract): void {
    this.selectedContract = contract;
    this.showForm = true;
    this.activeMenu = null;
  }

  addContract(): void {
    this.selectedContract = null;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedContract = null;
    if (event) {
      this.fetchContracts();
    }
  }

  openDocuments(contract: Contract): void {
    this.showDocuments = true;
    this.selectedContract = contract;
  }

  downloadContract(contract: Contract): void {
    const requestId = contract.requestId;
    const baseUrl = environment.apiUrl;

    const url = `${baseUrl}/Publishers/Contracts/PrintContract/${requestId}`;
    window.open(url);
  }

  closeDocuments(): void {
    this.showDocuments = false;
    this.selectedContract = null;
  }

  updateContractStatus(contractId: number, status: ContractStatus): void {
    this.activeMenu = null;
    this.http.put(`Publishers/Contracts`, {
      contractId: contractId,
      status: status
    }).subscribe({
      next: (response) => {
        this.fetchContracts();
      },
      error: (error) => {
        console.error('Failed to upload file', error);
      },
    });
  }
}
