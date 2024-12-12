import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faPhone,
  faStar,
  faStarHalf,
  faPalette,
  faBook,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import { Publisher, ServiceType } from '../../../../shared/models/Publisher';
import { AddPublisherRequestEditorComponent } from "./add-publisher-request-editor/add-publisher-request-editor.component";

@Component({
  selector: 'app-add-publisher-requests',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FontAwesomeModule, AddPublisherRequestEditorComponent],
  providers: [HttpService],
  templateUrl: './publishers.component.html',
  styleUrl: './publishers.component.scss'
})
export class PublishersComponent implements OnInit {
  publishers: Publisher[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  showForm = false;
  selectedPublisher: Publisher | null = null;

  // Font Awesome icons
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faStar = faStar;
  faStarHalf = faStarHalf;
  faPalette = faPalette;
  faBook = faBook;
  faClipboardCheck = faClipboardCheck;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchPublishers();
  }

  fetchPublishers(): void {
    this.http.get<any>(`Publisher`).subscribe({
      next: (data) => {
        this.publishers = data;
      }
    });
  }

  toggleMenu(event: Event, publisherId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === publisherId ? null : publisherId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }


  onAddPublisher(): void {
    this.selectedPublisher = null;
    this.showForm = true;
  }

  addRequest(publisher: Publisher): void {
    this.selectedPublisher = publisher;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedPublisher = null;
  }

  getServiceIcon(service: ServiceType): any {
    switch (service.serviceTypeId) {
      case 1: return this.faPalette;
      case 2: return this.faBook;
      case 3: return this.faClipboardCheck;
      default: return this.faBook;
    }
  }
}