import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../../../shared/core/services/http.service';
import { Book } from '../../../../shared/models/Book';
import { CommonModule } from '@angular/common';
import { DownloadFileComponent } from "../../../../shared/components/download-file/download-file.component";



@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, DownloadFileComponent],
  providers: [HttpService],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit {
  books: Book[] = [];
  user = JSON.parse(localStorage.getItem('user') ?? '{}');

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.http.get(`Author/${this.user['authorId']}/books`).subscribe({
      next: (response: any) => {
        this.books = response || [];
      },
      error: (error) => {
        console.error('Failed to fetch books', error);
      }
    });
  }
}