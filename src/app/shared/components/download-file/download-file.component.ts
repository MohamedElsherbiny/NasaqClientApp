import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BookDocument } from '../../models/BookDocument';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-download-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-file.component.html',
  styleUrl: './download-file.component.scss',
})
export class DownloadFileComponent {
  @Input() bookId: number = 0;
  @Input() bookDocuments?: BookDocument[] = [];
  private baseUrl: string = environment.apiUrl;

  downloadFile(bookDocument: BookDocument): void {
    if (!bookDocument.file) {
      console.error('File URL is required.');
      return;
    }
    const apiUrl = `${this.baseUrl}/Files/download?url=${encodeURIComponent(
      bookDocument.file
    )}&name=${bookDocument.documentName}&version=${bookDocument.version}`;
    window.open(apiUrl, '_blank');
  }

  openDocumentListModal(): void {
    const modalElement = document.getElementById('document-list-modal' + this.bookId);
    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }
}
