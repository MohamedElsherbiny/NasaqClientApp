import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { HttpService } from '../../../../shared/core/services/http.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faDownload,
  faEllipsisVertical,
  faPen,
  faTrash,
  faTable
} from '@fortawesome/free-solid-svg-icons';
import { AuthorBookEditorComponent } from "./author-book-editor/author-book-editor.component";
import { Book } from '../../../../shared/models/Book';
import { BookDocumentsComponent } from "../../../../shared/components/book-documents/book-documents.component";
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-author-books',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FontAwesomeModule, AuthorBookEditorComponent, BookDocumentsComponent, MatPaginator],
  providers: [HttpService],
  templateUrl: './author-books.component.html',
  styleUrl: './author-books.component.scss'
})
export class AuthorBooksComponent implements OnInit {
  books: Book[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');
  activeMenu: number | null = null;
  showForm = false;
  showDocuments = false;
  selectedBook: Book | null = null;
  totalCount = 0
  searchQuery = ''
  pageIndex = 0
  pageSize = 4

  // Font Awesome icons
  faPlus = faPlus;
  faDownload = faDownload;
  faEllipsisVertical = faEllipsisVertical;
  faPen = faPen;
  faTrash = faTrash;
  faTable = faTable;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`, {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      keyword: this.searchQuery
    }).subscribe({
      next: (response: any) => {
        this.books = response?.items || [];
        this.totalCount = response?.totalCount || 0;
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }

  toggleMenu(event: Event, bookId: number): void {
    event.stopPropagation();
    this.activeMenu = this.activeMenu === bookId ? null : bookId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenu = null;
  }

  onAddBook(): void {
    this.selectedBook = null;
    this.showForm = true;
  }

  editBook(project: Book): void {
    this.selectedBook = project;
    this.showForm = true;
    this.activeMenu = null;
  }

  closeForm(event: boolean): void {
    this.showForm = false;
    this.selectedBook = null;
    if (event) {
      this.fetchBooks();
    }
  }

  openDocuments(book: Book): void {
    this.selectedBook = book;
    this.showDocuments = true;
  }

  closeDocuments(): void {
    this.showDocuments = false;
    this.selectedBook = null;
  }

  onPageChange(page: any): void {
    this.pageIndex = page.pageIndex;
    this.fetchBooks();
  }
}