import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isCollapsed = new BehaviorSubject<boolean>(false);

  getIsCollapsed() {
    return this.isCollapsed.asObservable();
  }

  toggleSidebar() {
    this.isCollapsed.next(!this.isCollapsed.value);
  }
}