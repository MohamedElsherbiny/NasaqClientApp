import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';
import { ThemeService } from '../services/theme.service';
import { faBars, faChevronDown, faCog, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { ProfileEditorComponent } from '../profile-editor/profile-editor.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ProfileEditorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUser: any | null = null;
  showProfileForm = false;

  isDark = true;
  isProfileMenuOpen = false;

  // Font Awesome icons
  faBars = faBars;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faCog = faCog;
  faChevronDown = faChevronDown;

  constructor(
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.themeService.getTheme().subscribe(theme => {
      this.isDark = theme === 'dark';
    });
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUser.email = this.currentUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openProfileForm() {
    this.isProfileMenuOpen = false;
    this.showProfileForm = true;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  closeProfileForm() {
    this.showProfileForm = false;
    this.isProfileMenuOpen = false;
  }
}
