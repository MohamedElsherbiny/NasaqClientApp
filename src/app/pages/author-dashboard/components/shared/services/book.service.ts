import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books = new BehaviorSubject<Book[]>([
    {
      id: '1',
      title: 'رحلات في عالم الغموض',
      description: 'هو عمل أدبي يأخذ القارئ في رحلة مثيرة مليئة بالأسرار والمغامرات',
      isbn: '978-1234-5678-9101',
      publishDate: new Date('2024-11-25'),
      enabled: true
    },
    {
      id: '2',
      title: 'ألوان الحياة',
      description: 'مجموعة قصصية تسلط الضوء على حوادث متنوعة من التجارب الإنسانية',
      isbn: '978-5678-9101-1234',
      publishDate: new Date('2024-11-26'),
      enabled: true
    },
    {
      id: '3',
      title: 'في قلب العاصفة',
      description: 'رواية درامية تحكي قصة شابة تواجه عواصف الحياة بشجاعة وإصرار',
      isbn: '978-9101-1234-5678',
      publishDate: new Date('2024-11-25'),
      enabled: true
    }
  ]);

  getBooks(): Observable<Book[]> {
    return this.books.asObservable();
  }

  addBook(book: Book): void {
    const currentBooks = this.books.value;
    this.books.next([...currentBooks, book]);
  }

  updateBook(updatedBook: Book): void {
    const currentBooks = this.books.value;
    const updatedBooks = currentBooks.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    this.books.next(updatedBooks);
  }

  deleteBook(bookId: string): void {
    const currentBooks = this.books.value;
    const updatedBooks = currentBooks.filter(book => book.id !== bookId);
    this.books.next(updatedBooks);
  }
}