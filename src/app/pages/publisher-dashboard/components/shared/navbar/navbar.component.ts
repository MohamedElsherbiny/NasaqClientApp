import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';
import { ThemeService } from '../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faChevronDown, faCog, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
// import { PublisherProfileEditorComponent } from "../publisher-profile-editor/publisher-profile-editor.component";
import { PublisherServicesEditorComponent } from "../publisher-services-editor/publisher-services-editor.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PublisherServicesEditorComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentUser: any | null = null;
  showProfileForm = false;
  showServicesForm = false;

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

  get userInitials(): string {
    if (!this.currentUser?.name) return '';
    return 'A'; // this.currentUser.name.split(' ').map(n => n[0]).join('');
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // Close menu when clicking outside
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as Element).closest('.user-profile')) {
      this.isProfileMenuOpen = false;
    }
  }

  openProfileForm() {
    this.isProfileMenuOpen = false;
    this.showProfileForm = true;
  }

  closeProfileForm() {
    this.showProfileForm = false;
    this.isProfileMenuOpen = false;
  }


  openServicesForm() {
    this.isProfileMenuOpen = false;
    this.showServicesForm = true;
  }

  closeServiceForm() {
    this.showServicesForm = false;
    this.isProfileMenuOpen = false;
  }
}
