import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ThemeService } from './components/shared/services/theme.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-author-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule, RouterOutlet],
  templateUrl: './author-dashboard.component.html',
  styleUrl: './author-dashboard.component.scss'
})
export class AuthorDashboardComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getTheme().subscribe();
  }
}