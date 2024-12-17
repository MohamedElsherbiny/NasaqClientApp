import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BookDocument } from '../../models/BookDocument';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Book } from '../../models/Book';

@Component({
  selector: 'app-book-documents',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './book-documents.component.html',
  styleUrl: './book-documents.component.scss',
})
export class BookDocumentsComponent {
  @Input() bookDocuments?: BookDocument[] = [];
  @Output() close = new EventEmitter<boolean>();

  private baseUrl: string = environment.apiUrl;
  faTimes = faTimes;
  faDownload = faDownload;

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

  onClose() {
    this.close.emit();
  }

  // openDocumentListModal(): void {
  //   const modalElement = document.getElementById('document-list-modal' + this.bookId);
  //   if (modalElement) {
  //     const modalInstance =
  //       bootstrap.Modal.getInstance(modalElement) ||
  //       new bootstrap.Modal(modalElement);
  //     modalInstance.show();
  //   }
  // }
}
