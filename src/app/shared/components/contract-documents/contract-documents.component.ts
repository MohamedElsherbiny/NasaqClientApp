import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ContractFile } from '../../models/Contract';

@Component({
  selector: 'app-contract-documents',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './contract-documents.component.html',
  styleUrl: './contract-documents.component.scss',
})
export class ContractDocumentsComponent {
  @Input() contractDocuments?: ContractFile[] = [];
  @Output() close = new EventEmitter<boolean>();

  private baseUrl: string = environment.apiUrl;
  faTimes = faTimes;
  faDownload = faDownload;

  downloadFile(contractDocument: ContractFile): void {
    if (!contractDocument.file) {
      console.error('File URL is required.');
      return;
    }
    const apiUrl = `${this.baseUrl}/Files/download?url=${encodeURIComponent(
      contractDocument.file
    )}&name=${contractDocument.fileName}&version=${contractDocument.version}`;
    window.open(apiUrl, '_blank');
  }

  onClose() {
    this.close.emit();
  }
}
