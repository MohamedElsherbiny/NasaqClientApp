import { Component, Input, input } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-download-file',
  standalone: true,
  imports: [],
  templateUrl: './download-file.component.html',
  styleUrl: './download-file.component.scss',
})
export class DownloadFileComponent {
  @Input() fileUrl?: string;
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpService) {}

  downloadFile(): void {
    if (!this.fileUrl) {
      console.error('File URL is required.');
      return;
    }
    const apiUrl = `${this.baseUrl}/Files/download?url=${encodeURIComponent(
      this.fileUrl
    )}`;

    window.open(apiUrl, '_blank');
  }
}
