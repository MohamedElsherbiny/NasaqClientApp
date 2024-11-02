import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoginFormComponent } from "./login-form/login-form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
