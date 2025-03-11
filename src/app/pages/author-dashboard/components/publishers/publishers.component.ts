import { HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  faEnvelope,
  faPhone,
  faStar,
  faStarHalf,
  faPalette,
  faBook,
  faClipboardCheck,
  faThLarge,
  faList,
  faSearch,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { Publisher, ServiceType } from '../../../../shared/models/Publisher';
import { AddPublisherRequestEditorComponent } from "./add-publisher-request-editor/add-publisher-request-editor.component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-publisher-requests',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    FontAwesomeModule,
    AddPublisherRequestEditorComponent],
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
  pageSize = 4;
  pageIndex = 0;
  totalCount = 0;
  viewMode: 'grid' | 'list' = 'list';
  searchQuery = '';
  availableServices = ['publishing', 'design', 'auditing'];
  sortBy = '';
  filters = {
    publisher: true,
    freelancer: false
  };

  // Font Awesome icons
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faStar = faStar;
  faStarHalf = faStarHalf;
  faPalette = faPalette;
  faBook = faBook;
  faClipboardCheck = faClipboardCheck;
  faThLarge = faThLarge;
  faList = faList;
  faSearch = faSearch;
  faSort = faSort;

  constructor(private http: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPublishers();
  }


  fetchPublishers(): void {
    let publisherType = null;
    if (this.filters.publisher && !this.filters.freelancer) {
      publisherType = 1;
    } else if (!this.filters.publisher && this.filters.freelancer) {
      publisherType = 2;
    }

    this.http.get<any>(`Publisher`, {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      keyword: this.searchQuery,
      sortBy: this.sortBy,
      publisherType: publisherType
    }).subscribe({
      next: (data) => {
        this.publishers = data.items;
        this.totalCount = data.totalCount;
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

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedPublisher = null;
    if (event) {
      this.router.navigate(['/author-dashboard/requests']);
    }
  }

  getServiceIcon(service: ServiceType): any {
    switch (service.serviceTypeId) {
      case 1: return this.faPalette;
      case 2: return this.faBook;
      case 3: return this.faClipboardCheck;
      default: return this.faBook;
    }
  }

  filterPublishers(): void {
    this.fetchPublishers();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    if (mode === 'grid') {
      this.pageSize = 15;
    } else {
      this.pageSize = 4;
    }
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchPublishers();
  }

}