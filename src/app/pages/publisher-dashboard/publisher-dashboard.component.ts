import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ThemeService } from './components/shared/services/theme.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-publisher-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule, RouterOutlet],
  templateUrl: './publisher-dashboard.component.html',
  styleUrl: './publisher-dashboard.component.scss'
})
export class PublisherDashboardComponent implements OnInit {

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.getTheme().subscribe();
  }
}