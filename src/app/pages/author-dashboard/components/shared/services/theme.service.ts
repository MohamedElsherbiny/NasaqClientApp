import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('dark');

  constructor() {
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    this.setTheme(savedTheme);
  }

  getTheme(): Observable<Theme> {
    return this.currentTheme.asObservable();
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }

  setTheme(theme: Theme) {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Force re-calculation of CSS variables
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';
  }

  toggleTheme() {
    const newTheme = this.currentTheme.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}