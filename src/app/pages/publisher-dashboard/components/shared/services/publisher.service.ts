import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publisher } from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private publishers = new BehaviorSubject<Publisher[]>([
    {
      id: '1',
      name: 'دار النشر الأولى',
      description: 'دار نشر متخصصة في الكتب الأدبية والثقافية',
      services: ['publishing', 'design', 'auditing'],
      email: 'contact@publisher1.com',
      phone: '+966 11 234 5678',
      rating: 4.5
    },
    {
      id: '2',
      name: 'المكتبة العصرية',
      description: 'خدمات نشر متكاملة للكتاب والمؤلفين',
      services: ['publishing', 'design'],
      email: 'info@modernlibrary.com',
      phone: '+966 12 345 6789',
      rating: 4.2
    },
    {
      id: '3',
      name: 'دار الكتاب العربي',
      description: 'متخصصون في نشر الكتب العلمية والأكاديمية',
      services: ['publishing', 'auditing'],
      email: 'contact@arabicbooks.com',
      phone: '+966 13 456 7890',
      rating: 4.8
    }
  ]);

  getPublishers(): Observable<Publisher[]> {
    return this.publishers.asObservable();
  }

  sendRequest(publisherId: string): void {
    console.log(`Request sent to publisher ${publisherId}`);
    // Here you would typically make an API call to send the request
  }
}