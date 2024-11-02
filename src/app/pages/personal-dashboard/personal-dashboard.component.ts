import { Component } from '@angular/core';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { SidebarComponent } from "./components/shared/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-personal-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './personal-dashboard.component.html',
  styleUrl: './personal-dashboard.component.scss'
})
export class PersonalDashboardComponent {

}
