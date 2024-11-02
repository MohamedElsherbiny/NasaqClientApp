import { Component } from '@angular/core';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-corporate-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './corporate-dashboard.component.html',
  styleUrl: './corporate-dashboard.component.scss'
})
export class CorporateDashboardComponent {

}
