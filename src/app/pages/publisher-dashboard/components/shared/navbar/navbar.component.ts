import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';
import { ThemeService } from '../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isDark = true;
  faBars = faBars;
  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.themeService.getTheme().subscribe(theme => {
      this.isDark = theme === 'dark';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
